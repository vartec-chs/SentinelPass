use rusqlite::{params, Connection, Error as RusqliteError, OpenFlags};
use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri_plugin_store::StoreExt;

use crate::db::models::password_storage::PasswordStorageModel;

pub struct DBManager {
    connection: Arc<Mutex<Option<Connection>>>,
    path: Option<PathBuf>,
}

impl Default for DBManager {
    fn default() -> Self {
        Self {
            connection: Arc::new(Mutex::new(None)),
            path: None,
        }
    }
}

#[derive(Debug, thiserror::Error)]
pub enum DBManagerError {
    #[error("Ошибка базы данных: {0}")]
    Database(#[from] RusqliteError),
    #[error("Неверный ключ шифрования")]
    InvalidKey,
}

impl DBManager {
    pub fn set_path(&mut self, path: PathBuf) {
        self.path = Some(path);
    }

    pub fn get_path(&self) -> Option<PathBuf> {
        self.path.clone()
    }

    /// Создание новой базы данных и таблицы
    pub fn create(
        &mut self,
        path: PathBuf,
        data: PasswordStorageModel,
    ) -> Result<(), DBManagerError> {
        let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
        let conn = Connection::open_with_flags(&path, flags)?;

        conn.pragma_update(None, "key", &data.master_password)?;
        Self::create_main_table(&conn, &data)?;

        let mut lock = self.connection.lock().unwrap();
        *lock = Some(conn);
        self.path = Some(path);

        Ok(())
    }

    /// Открытие базы данных с проверкой валидности пароля
    pub fn open(&mut self, path: PathBuf, master_password: String) -> Result<(), DBManagerError> {
        let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
        let conn = Connection::open_with_flags(&path, flags)?;

        conn.pragma_update(None, "key", &master_password)?;

        {
            let mut stmt = conn
                .prepare("SELECT id FROM password_storage LIMIT 1")
                .map_err(|err| match err {
                    RusqliteError::SqliteFailure(_, _) => DBManagerError::InvalidKey,
                    other => DBManagerError::Database(other),
                })?;

            let result: Result<String, RusqliteError> = stmt.query_row([], |row| row.get(0));

            match result {
                Ok(_) => {}
                Err(RusqliteError::QueryReturnedNoRows) => {}
                Err(RusqliteError::SqliteFailure(_, _)) => return Err(DBManagerError::InvalidKey),
                Err(err) => return Err(DBManagerError::Database(err)),
            }
        }

        let mut lock = self.connection.lock().unwrap();
        *lock = Some(conn);
        self.path = Some(path);

        Ok(())
    }

    /// Закрытие соединения с базой данных и сохранение пути
    pub fn close(&mut self, app_handle: &tauri::AppHandle) -> Result<String, DBManagerError> {
        let mut lock = self.connection.lock().unwrap();
        if let Some(conn) = lock.take() {
            let result = conn.close();

            match result {
                Ok(_) => {
                    if let Ok(settings) = app_handle.store("settings.json") {
                        if let Some(path) = self.path.clone() {
                            settings.set("db_path", path.to_str().unwrap());
                            // settings.save(); // если нужно
                        }
                    }

                    println!("Соединение с базой данных успешно закрыто.");
                    Ok("Соединение с базой данных успешно закрыто.".to_string())
                }
                Err((conn, err)) => {
                    println!("Ошибка при закрытии соединения: {}", err);
                    *lock = Some(conn);
                    Err(DBManagerError::Database(err))
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

impl DBManager {
    pub fn with_connection<F, R>(&self, f: F) -> Result<R, DBManagerError>
    where
        F: FnOnce(&Connection) -> R,
    {
        let lock = self.connection.lock().unwrap();
        match lock.as_ref() {
            Some(conn) => Ok(f(conn)),
            None => Err(DBManagerError::Database(RusqliteError::InvalidQuery)), // или своё
        }
    }
}
