use rusqlite::{params, Connection, Error as RusqliteError, OpenFlags};
use std::{path::PathBuf, sync::Arc};
use tauri_plugin_store::StoreExt;
use tokio::{sync::Mutex, task::spawn_blocking};

use crate::db::models::password_storage::PasswordStorageModel;

pub struct DBManager {
    connection: Arc<Mutex<Option<Connection>>>,
    path: Option<PathBuf>,
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
            path: None,
        }
    }

    pub fn set_path(&mut self, path: PathBuf) {
        self.path = Some(path);
    }

    pub fn get_path(&self) -> Option<PathBuf> {
        self.path.clone()
    }

    /// Создание новой базы данных и таблицы
    pub async fn create(
        &mut self,
        path: PathBuf,
        data: PasswordStorageModel,
    ) -> Result<(), DbOpenError> {
        let path_db = path.clone();
        let key = data.master_password.clone();

        let connection = spawn_blocking(move || -> Result<Connection, DbOpenError> {
            let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
            let conn =
                Connection::open_with_flags(path_db, flags).map_err(DbOpenError::Database)?;

            // Устанавливаем ключ безопасно
            conn.pragma_update(None, "key", &key)
                .map_err(DbOpenError::Database)?;

            // Создаём таблицу и вставляем запись
            Self::create_main_table(&conn, &data).map_err(DbOpenError::Database)?;

            Ok(conn)
        })
        .await
        .map_err(|_| DbOpenError::TaskJoinError)??;

        {
            let mut conn_lock = self.connection.lock().await;
            *conn_lock = Some(connection);
        }

        self.path = Some(path);

        Ok(())
    }

    /// Открытие базы данных с проверкой валидности пароля
    pub async fn open(
        &mut self,
        path: PathBuf,
        master_password: String,
    ) -> Result<(), DbOpenError> {
        let path_db = path.clone();
        let key = master_password.clone();

        let connection = spawn_blocking(move || -> Result<Connection, DbOpenError> {
            let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
            let conn =
                Connection::open_with_flags(path_db, flags).map_err(DbOpenError::Database)?;

            conn.pragma_update(None, "key", &key)
                .map_err(DbOpenError::Database)?;

            // Проверка пароля внутри блока, чтобы stmt освободился
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

            Ok(conn)
        })
        .await
        .map_err(|_| DbOpenError::TaskJoinError)??;

        {
            let mut conn_lock = self.connection.lock().await;
            *conn_lock = Some(connection);
        }

        self.path = Some(path);

        Ok(())
    }

    /// Закрытие соединения с базой данных и сохранение пути в settings.json
    pub async fn close(&mut self, app_handle: &tauri::AppHandle) -> Result<String, DbOpenError> {
        if let Some(conn) = self.connection.lock().await.take() {
            let result = spawn_blocking(move || conn.close())
                .await
                .map_err(|_| DbOpenError::TaskJoinError)?;

            match result {
                Ok(_) => {
                    // Сохраняем путь в settings.json
                    if let Ok(settings) = app_handle.store("settings.json") {
                        if let Some(path) = self.path.to_owned() {
                            settings.set("db_path", path.to_str().unwrap());
                            // settings.save() можно добавить, если необходимо
                        }
                    }

                    println!("Соединение с базой данных успешно закрыто.");
                    Ok("Соединение с базой данных успешно закрыто.".to_string())
                }
                Err((conn, err)) => {
                    println!("Ошибка при закрытии соединения: {}", err);
                    *self.connection.lock().await = Some(conn);
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
