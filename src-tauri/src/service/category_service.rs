use std::sync::{Arc, Mutex};

use anyhow::{Error, Result};
use rusqlite::{params, Connection};

use crate::{
    db::models::category::Category,
    dto::category_dto::{CategoryDto, CreateCategoryDto, UpdateCategoryDto},
};

pub struct CategoryService;
impl CategoryService {
    /// Создание новой категории
    pub async fn create(
        conn: &Arc<Mutex<Option<Connection>>>,
        dto: CreateCategoryDto,
    ) -> Result<CategoryDto> {
        let category = Category::new(dto.name, dto.description, dto.icon);
        let insert = category.clone();

        let conn = Arc::clone(&conn);
        tokio::task::spawn_blocking(move || {
            let conn_mt = conn
                .lock()
                .map_err(|e| Error::msg(format!("Mutex poison error: {}", e)))?;
            let conn = conn_mt
                .as_ref()
                .ok_or(Error::msg("Connection not initialized"))?;
            conn.execute(
                "INSERT INTO categories (id, name, description, icon, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?)",
                params![
                    insert.id,
                    insert.name,
                    insert.description,
                    insert.icon,
                    insert.created_at,
                    insert.updated_at
                ],
            )?;
            Ok::<_, Error>(()) // Явное указание типа ошибки
        })
        .await??;

        Ok(category.to_dto())
    }

    /// Обновление категории
    // pub async fn update(conn: &Arc<Mutex<Option<Connection>>>, category: &UpdateCategoryDto) -> Result<()> {
	
    //     let updated = Category {
    //         updated_at: chrono::Utc::now().to_rfc3339(),
    //         ..category.clone()
    //     };

    //     let conn = Arc::clone(&conn);
    //     tokio::task::spawn_blocking(move || {
    //         let conn_mt = conn
    //             .lock()
    //             .map_err(|e| Error::msg(format!("Mutex poison error: {}", e)))?;
    //         let conn = conn_mt.as_ref().ok_or(Error::msg("Connection not initialized"))?;

    //         conn.execute(
    //             "UPDATE categories SET name = ?, description = ?, icon = ?, updated_at = ? WHERE id = ?",
    //             params![
    //                 updated.name,
    //                 updated.description,
    //                 updated.icon,
    //                 updated.updated_at,
    //                 updated.id
    //             ],
    //         )?;
    //         Ok::<_, Error>(()) // Явное указание типа ошибки
    //     })
    //     .await??;

    //     Ok(())
    // }

    /// Удаление категории
    pub async fn delete(conn: &Arc<Mutex<Option<Connection>>>, id: String) -> Result<()> {
        let conn = Arc::clone(&conn);
        tokio::task::spawn_blocking(move || {
            let conn_mt = conn
                .lock()
                .map_err(|e| Error::msg(format!("Mutex poison error: {}", e)))?;
            let conn = conn_mt
                .as_ref()
                .ok_or(Error::msg("Connection not initialized"))?;
            conn.execute("DELETE FROM categories WHERE id = ?", params![id])?;
            Ok::<_, Error>(()) // Явное указание типа ошибки
        })
        .await??;

        Ok(())
    }

    /// Получение всех категорий
    pub async fn get_all(conn: &Arc<Mutex<Option<Connection>>>) -> Result<Vec<CategoryDto>> {
        let conn = Arc::clone(&conn);
        let categories = tokio::task::spawn_blocking(move || {
            let conn_mt = conn
                .lock()
                .map_err(|e| Error::msg(format!("Mutex poison error: {}", e)))?;
            let conn = conn_mt
                .as_ref()
                .ok_or(Error::msg("Connection not initialized"))?;

            let mut stmt = conn.prepare("SELECT * FROM categories ORDER BY name ASC")?;
            let rows = stmt
                .query_map([], |row| Category::init_from_row(row))?
                .collect::<Result<Vec<_>, _>>()?;

            Ok::<_, Error>(rows) // Явное указание типа ошибки
        })
        .await??;

        Ok(Category::to_category_dtos(categories))
    }

    /// Получение категории по ID
    pub async fn get_by_id(
        conn: &Arc<Mutex<Option<Connection>>>,
        id: String,
    ) -> Result<Option<CategoryDto>> {
        let conn = Arc::clone(&conn);

        let category =
            tokio::task::spawn_blocking(move || -> Result<Option<Category>, rusqlite::Error> {
                let conn_mt = conn.lock().map_err(|_| rusqlite::Error::InvalidQuery)?; // Или другой rusqlite::Error

                let conn = conn_mt.as_ref().ok_or(rusqlite::Error::InvalidQuery)?;

                let mut stmt = conn.prepare("SELECT * FROM categories WHERE id = ?")?;
                let mut rows = stmt.query(rusqlite::params![id])?;

                if let Some(row) = rows.next()? {
                    Category::init_from_row(&row).map(Some)
                } else {
                    Ok(None)
                }
            })
            .await
            .map_err(|_| rusqlite::Error::InvalidQuery)??; // Переводим JoinError в rusqlite::Error

        Ok(category.map(|c| c.into()))
    }
}
