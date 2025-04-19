use rusqlite::{params, Connection, Error as RusqliteError, OpenFlags};
use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri_plugin_store::StoreExt;

use crate::db::models::password_storage::PasswordStorageModel;

pub struct DBManager {
    connection: Arc<Mutex<Option<Connection>>>,
    path: Arc<Mutex<Option<PathBuf>>>,
}

#[derive(Debug, thiserror::Error)]
pub enum DbOpenError {
    #[error("Ошибка базы данных: {0}")]
    Database(#[from] RusqliteError),

    #[error("Неверный ключ шифрования")]
    InvalidKey,

    #[error("Ошибка выполнения задачи")]
    TaskJoinError,
}

impl DBManager {
    pub fn init() -> Self {
        Self {
            connection: Arc::new(Mutex::new(None)),
            path: Arc::new(Mutex::new(None)),
        }
    }

    pub fn set_path(&self, path: PathBuf) {
        let mut guard = self.path.lock().unwrap();
        *guard = Some(path);
    }

    pub fn get_path(&self) -> Option<PathBuf> {
        self.path.lock().unwrap().clone()
    }

    pub fn get_connection(&self) -> &Arc<Mutex<Option<Connection>>> {
        &self.connection
    }

    /// Создание новой базы данных и таблицы (SYCN, для spawn_blocking)
    pub fn create_sync(
        &self,
        path: PathBuf,
        data: PasswordStorageModel,
    ) -> Result<(), DbOpenError> {
        let key = data.master_password.clone();
        let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
        let conn = Connection::open_with_flags(&path, flags).map_err(DbOpenError::Database)?;

        conn.pragma_update(None, "key", &key)
            .map_err(DbOpenError::Database)?;

        Self::create_main_table(&conn, &data).map_err(DbOpenError::Database)?;

        *self.connection.lock().unwrap() = Some(conn);
        *self.path.lock().unwrap() = Some(path);

        Ok(())
    }

    /// Открытие базы данных с проверкой валидности пароля (SYNC)
    pub fn open_sync(&self, path: PathBuf, master_password: String) -> Result<(), DbOpenError> {
        let key = master_password.clone();
        let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
        let conn = Connection::open_with_flags(&path, flags).map_err(DbOpenError::Database)?;

        conn.pragma_update(None, "key", &key)
            .map_err(DbOpenError::Database)?;

        {
            let mut stmt = conn
                .prepare("SELECT id FROM password_storage LIMIT 1")
                .map_err(|err| match err {
                    RusqliteError::SqliteFailure(_, _) => DbOpenError::InvalidKey,
                    other => DbOpenError::Database(other),
                })?;

            let result: Result<String, RusqliteError> = stmt.query_row([], |row| row.get(0));

            match result {
                Ok(_) => {}
                Err(RusqliteError::QueryReturnedNoRows) => {}
                Err(RusqliteError::SqliteFailure(_, _)) => {
                    return Err(DbOpenError::InvalidKey);
                }
                Err(err) => {
                    return Err(DbOpenError::Database(err));
                }
            }
        }

        *self.connection.lock().unwrap() = Some(conn);
        *self.path.lock().unwrap() = Some(path);

        Ok(())
    }

    /// Закрытие соединения с базой данных и сохранение пути в settings.json (SYNC)
    pub fn close_sync(&self, app_handle: &tauri::AppHandle) -> Result<String, DbOpenError> {
        let mut lock = self.connection.lock().unwrap();

        if let Some(conn) = lock.take() {
            match conn.close() {
                Ok(_) => {
                    // Сохраняем путь в settings.json
                    if let Ok(settings) = app_handle.store("settings.json") {
                        if let Some(path) = self.path.lock().unwrap().to_owned() {
                            settings.set("db_path", path.to_str().unwrap());
                        }
                    }
                    println!("Соединение с базой данных успешно закрыто.");
                    Ok("Соединение с базой данных успешно закрыто.".to_string())
                }
                Err((conn, err)) => {
                    println!("Ошибка при закрытии соединения: {}", err);
                    *lock = Some(conn);
                    Err(DbOpenError::Database(err))
                }
            }
        } else {
            Ok("Соединение уже закрыто.".to_string())
        }
    }

    /// Создание основной таблицы и вставка первой записи
    fn create_main_table(
        conn: &Connection,
        data: &PasswordStorageModel,
    ) -> Result<(), RusqliteError> {
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS password_storage (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT DEFAULT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT DEFAULT NULL
            )",
        )?;

        conn.execute(
            "INSERT INTO password_storage (
                id, 
                name, 
                description, 
                created_at, 
                updated_at 
            ) VALUES (?, ?, ?, ?, ?)",
            params![
                data.id.to_string(),
                data.name,
                data.description,
                data.created_at,
                data.updated_at
            ],
        )?;

        Ok(())
    }
}
