use chrono::Utc;
use rusqlite::Row;
use uuid::Uuid;

use crate::dto::category_dto::CategoryDto;

#[derive(Debug, Clone)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl Category {
    /// Создание новой категории перед вставкой в БД
    pub fn new(name: String, description: Option<String>, icon: Option<String>) -> Self {
        let now = Utc::now().to_rfc3339();
        Category {
            id: Uuid::new_v4().to_string(),
            name,
            description,
            icon,
            created_at: now.clone(),
            updated_at: now,
        }
    }

    /// Инициализация из rusqlite::Row
    pub fn init_from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Category {
            id: row.get("id")?,
            name: row.get("name")?,
            description: row.get("description").ok(),
            icon: row.get("icon").ok(),
            created_at: row.get("created_at")?,
            updated_at: row.get("updated_at")?,
        })
    }

    pub fn to_dto(&self) -> CategoryDto {
        CategoryDto {
            id: self.id.clone(),
            name: self.name.clone(),
            description: self.description.clone(),
            icon: self.icon.clone(),
            created_at: self.created_at.clone(),
            updated_at: self.updated_at.clone(),
        }
    }

    pub fn to_categories_dto(categories: Vec<Category>) -> Vec<CategoryDto> {
        categories.into_iter().map(Into::into).collect()
    }
}

impl From<Category> for CategoryDto {
    fn from(c: Category) -> Self {
        CategoryDto {
            id: c.id,
            name: c.name,
            description: c.description,
            icon: c.icon,
            created_at: c.created_at,
            updated_at: c.updated_at,
        }
	}
}



