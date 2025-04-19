use std::sync::{Arc, Mutex};
use rusqlite::{params, Connection};
use anyhow::{anyhow, Result};
use crate::db::models::password::Password;
use crate::dto::password_dto::{PasswordDto, CreatePasswordDto, UpdatePasswordDto};

pub struct PasswordService;

impl PasswordService {
    /// Создание нового пароля.
    pub async fn create_password(
        conn: Arc<Mutex<Connection>>,
        dto: CreatePasswordDto,
    ) -> Result<PasswordDto> {
        let conn_clone = Arc::clone(&conn);

        let result: Result<PasswordDto> = tokio::task::spawn_blocking(move || {
            let conn = conn_clone
                .lock()
                .map_err(|e| anyhow!("Mutex error: {}", e))?;
            
            // is_favorite берём из DTO, если не задано – false.
            let is_favorite = dto.is_favorite.unwrap_or(false);
            
            let pwd = Password::new(
                dto.name,
                dto.description,
                is_favorite,
                dto.url,
                dto.password,
                dto.login,
                dto.category_id,
            );

            conn.execute(
                "INSERT INTO passwords (id, name, description, is_favorite, url, password, login, category_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                params![
                    pwd.id,
                    pwd.name,
                    pwd.description,
                    if pwd.is_favorite {1} else {0},
                    pwd.url,
                    pwd.password,
                    pwd.login,
                    pwd.category_id,
                    pwd.created_at,
                    pwd.updated_at,
                ],
            )?;

            Ok(PasswordDto {
                id: pwd.id,
                name: pwd.name,
                description: pwd.description,
                is_favorite: pwd.is_favorite,
                url: pwd.url,
                password: pwd.password,
                login: pwd.login,
                category_id: pwd.category_id,
                created_at: pwd.created_at,
                updated_at: pwd.updated_at,
            })
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?;

        Ok(result?)
    }

    /// Обновление пароля.
    pub async fn update_password(
        conn: Arc<Mutex<Connection>>,
        dto: UpdatePasswordDto,
    ) -> Result<PasswordDto> {
        let conn_clone = Arc::clone(&conn);
        let result: Result<PasswordDto> = tokio::task::spawn_blocking(move || {
            let conn = conn_clone
                .lock()
                .map_err(|e| anyhow!("Mutex error: {}", e))?;
            
            // Обновляем поле updated_at
            let updated_at = chrono::Utc::now().to_rfc3339();
            
            conn.execute(
                "UPDATE passwords 
                 SET name = ?, description = ?, is_favorite = ?, url = ?, password = ?, login = ?, category_id = ?, updated_at = ?
                 WHERE id = ?",
                params![
                    dto.name,
                    dto.description,
                    // Если значение не передано, оставим 0 (false)
                    dto.is_favorite.unwrap_or(false).then(|| 1).unwrap_or(0),
                    dto.url,
                    dto.password,
                    dto.login,
                    dto.category_id,
                    updated_at,
                    dto.id,
                ],
            )?;

            // Для простоты возвращаем обновлённое значение (без чтения из БД).
            Ok(PasswordDto {
                id: dto.id,
                name: dto.name,
                description: dto.description,
                is_favorite: dto.is_favorite.unwrap_or(false),
                url: dto.url,
                password: dto.password,
                login: dto.login,
                category_id: dto.category_id,
                created_at: String::new(), // Можно вернуть сохранённое время создания, если его прочитать
                updated_at,
            })
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?;

        Ok(result?)
    }

    /// Удаление пароля по ID.
    pub async fn delete_password(
        conn: Arc<Mutex<Connection>>,
        id: String,
    ) -> Result<()> {
        let conn_clone = Arc::clone(&conn);
        let result: Result<()> = tokio::task::spawn_blocking(move || {
            let conn = conn_clone
                .lock()
                .map_err(|e| anyhow!("Mutex error: {}", e))?;
            conn.execute(
                "DELETE FROM passwords WHERE id = ?",
                params![id],
            )?;
            Ok(())
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?;

        Ok(result?)
    }

    /// Получение всех паролей.
    pub async fn get_all_passwords(
        conn: Arc<Mutex<Connection>>,
    ) -> Result<Vec<PasswordDto>> {
        let conn_clone = Arc::clone(&conn);
        let result: Result<Vec<PasswordDto>> = tokio::task::spawn_blocking(move || {
            let conn = conn_clone
                .lock()
                .map_err(|e| anyhow!("Mutex error: {}", e))?;
            
            let mut stmt = conn.prepare("SELECT * FROM passwords ORDER BY updated_at DESC")?;
            let mut rows = stmt.query([])?;
            let mut passwords = Vec::new();

            while let Some(row) = rows.next()? {
                let pwd = Password::init_from_row(&row)?;
                passwords.push(PasswordDto {
                    id: pwd.id,
                    name: pwd.name,
                    description: pwd.description,
                    is_favorite: pwd.is_favorite,
                    url: pwd.url,
                    password: pwd.password,
                    login: pwd.login,
                    category_id: pwd.category_id,
                    created_at: pwd.created_at,
                    updated_at: pwd.updated_at,
                });
            }
            Ok(passwords)
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?;
        Ok(result?)
    }

    /// Получение пароля по ID.
    pub async fn get_password_by_id(
        conn: Arc<Mutex<Connection>>,
        id: String,
    ) -> Result<Option<PasswordDto>> {
        let conn_clone = Arc::clone(&conn);
        let result: Result<Option<PasswordDto>> = tokio::task::spawn_blocking(move || {
            let conn = conn_clone
                .lock()
                .map_err(|e| anyhow!("Mutex error: {}", e))?;
            let mut stmt = conn.prepare("SELECT * FROM passwords WHERE id = ?")?;
            let mut rows = stmt.query(params![id])?;
            if let Some(row) = rows.next()? {
                let pwd = Password::init_from_row(&row)?;
                Ok(Some(PasswordDto {
                    id: pwd.id,
                    name: pwd.name,
                    description: pwd.description,
                    is_favorite: pwd.is_favorite,
                    url: pwd.url,
                    password: pwd.password,
                    login: pwd.login,
                    category_id: pwd.category_id,
                    created_at: pwd.created_at,
                    updated_at: pwd.updated_at,
                }))
            } else {
                Ok(None)
            }
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?;
        Ok(result?)
    }
}
