use rusqlite::Error as RusqliteError;
use std::path::PathBuf;
use tokio_sqlcipher::{params, Connection as AsyncConnection, Error as AsyncError, OpenFlags};

use crate::db::models::password_storage::PasswordStorageModel;

pub struct DBManager {
    connection: Option<AsyncConnection>,
    path: Option<PathBuf>,
}

#[derive(Debug, thiserror::Error)]
pub enum DBManagerError {
    #[error("Ошибка базы данных: {0}")]
    Database(#[from] RusqliteError),

    #[error("Неверный ключ шифрования")]
    InvalidKey,

    #[error("Ошибка асинхронного выполнения: {0}")]
    AsyncDatabase(#[from] AsyncError),
}

impl DBManager {
    pub fn init() -> Self {
        Self {
            connection: None,
            path: None,
        }
    }

    pub fn set_path(&mut self, path: PathBuf) {
        self.path = Some(path);
    }

    pub fn get_path(&self) -> Option<PathBuf> {
        self.path.clone()
    }

    // pub fn connection(&mut self) -> &Option<AsyncConnection> {
    //     &self.connection
    // }

    pub async fn execute<F, T>(&self, f: F) -> Result<T, DBManagerError>
    where
        F: FnOnce(&mut rusqlite::Connection) -> Result<T, rusqlite::Error> + Send + 'static,
        T: Send + 'static,
    {
        let conn = self.connection.as_ref().ok_or(DBManagerError::InvalidKey)?;

        let result = conn
            .call(move |conn| f(conn).map_err(AsyncError::from)) // Оборачиваем rusqlite::Error в AsyncError
            .await?;

        Ok(result)
    }

    pub async fn create(
        &mut self,
        path: PathBuf,
        data: PasswordStorageModel,
    ) -> Result<(), DBManagerError> {
        let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
        let mut conn = AsyncConnection::open_with_flags(&path, flags).await?;

        let master_password = data.master_password.clone();

        conn.call(move |conn| {
            conn.pragma_update(None, "key", &master_password)
                .map_err(|e| e.into())
        })
        .await?;

        Self::create_main_table(&mut conn, &data).await?;

        self.connection = Some(conn);
        self.path = Some(path);
        Ok(())
    }

    pub async fn open(
        &mut self,
        path: PathBuf,
        master_password: String,
    ) -> Result<(), DBManagerError> {
        let flags = OpenFlags::SQLITE_OPEN_READ_WRITE;
        let conn = AsyncConnection::open_with_flags(&path, flags).await?;

        conn.call(move |conn| {
            conn.pragma_update(None, "key", &master_password)
                .map_err(|e| e.into())
        })
        .await?;

        let check_result: Result<(), rusqlite::Error> = conn
            .call(|conn| {
                let mut stmt = match conn.prepare("SELECT id FROM password_storage LIMIT 1") {
                    Ok(s) => s,
                    Err(e) => return Ok(Err(e)), // <- ❗ оборачиваем ошибку в Ok(Result)
                };

                match stmt.query_row([], |row| row.get::<_, String>(0)) {
                    Ok(_) => Ok(Ok(())),  // <- двойной Ok
                    Err(e) => Ok(Err(e)), // <- возврат ошибки, но не паникуем
                }
            })
            .await?; // здесь обрабатываем AsyncError, а не rusqlite::Error

        match check_result {
            Ok(_) => {}
            Err(e) => match e {
                RusqliteError::QueryReturnedNoRows => {}
                RusqliteError::SqliteFailure(_, _) => return Err(DBManagerError::InvalidKey),
                other => return Err(DBManagerError::Database(other)),
            },
        }

        self.connection = Some(conn);
        self.path = Some(path);
        Ok(())
    }

    pub async fn close(&mut self) -> Result<String, DBManagerError> {
        if let Some(conn) = self.connection.take() {
            conn.close().await?;
            self.connection = None; // Ensure connection is removed from the Option
            Ok("Соединение с базой данных успешно закрыто.".to_string())
        } else {
            Ok("Соединение уже закрыто.".to_string())
        }
    }

    async fn create_main_table(
        conn: &mut AsyncConnection,
        data: &PasswordStorageModel,
    ) -> Result<(), DBManagerError> {
        let data = data.clone();
        conn.call(move |conn| {
            conn.execute_batch(
                "CREATE TABLE IF NOT EXISTS password_storage (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT DEFAULT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT DEFAULT NULL
        );",
            );

            conn.execute(
                "INSERT INTO password_storage (
            id, name, description, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5)",
                params![
                    data.id.to_string(),
                    data.name,
                    data.description,
                    data.created_at,
                    data.updated_at
                ],
            );
            Ok(())
        })
        .await?;
        Ok(())
    }
}
