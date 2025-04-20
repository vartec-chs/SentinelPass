use anyhow::Result;
use chrono::Utc;
use rusqlite::{params, Connection};

use crate::{
    db::models::category::Category,
    dto::category_dto::{CategoryDto, CreateCategoryDto, UpdateCategoryDto},
};

pub struct CategoryService;

impl CategoryService {
    /// Создание новой категории
    pub fn create(conn: &Connection, dto: CreateCategoryDto) -> Result<CategoryDto> {
        let category = Category::new(dto.name, dto.description, dto.icon);

        conn.execute(
            "INSERT INTO categories (id, name, description, icon, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)",
            params![
                category.id,
                category.name,
                category.description,
                category.icon,
                category.created_at,
                category.updated_at
            ],
        )?;

        Ok(category.to_dto())
    }

    pub fn update(conn: &Connection, dto: UpdateCategoryDto) -> Result<()> {
        let updated_at = Utc::now().to_rfc3339();

        conn.execute(
        "UPDATE categories SET name = ?, description = ?, icon = ?, updated_at = ? WHERE id = ?",
        params![
            dto.name,
            dto.description,
            dto.icon,
            updated_at,
            dto.id
        ],
    )?;

        Ok(())
    }

    /// Удаление категории
    pub fn delete(conn: &Connection, id: &str) -> Result<()> {
        conn.execute("DELETE FROM categories WHERE id = ?", params![id])?;
        Ok(())
    }

    /// Получение всех категорий
    pub fn get_all(conn: &Connection) -> Result<Vec<CategoryDto>> {
        let mut stmt = conn.prepare("SELECT * FROM categories ORDER BY name ASC")?;
        let rows = stmt
            .query_map([], |row| Category::init_from_row(row))?
            .collect::<Result<Vec<_>, _>>()?;

        Ok(Category::to_categories_dto(rows))
    }

    /// Получение категории по ID
    pub fn get_by_id(conn: &Connection, id: &str) -> Result<Option<CategoryDto>> {
        let mut stmt = conn.prepare("SELECT * FROM categories WHERE id = ?")?;
        let mut rows = stmt.query(params![id])?;

        if let Some(row) = rows.next()? {
            let category = Category::init_from_row(&row)?;
            Ok(Some(category.into()))
        } else {
            Ok(None)
        }
    }
}
