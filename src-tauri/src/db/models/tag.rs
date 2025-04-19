use chrono::Utc;
use rusqlite::Row;
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct Tag {
    pub id: Uuid,
    pub name: String,
    pub created_at: String,
    pub updated_at: String,
}

impl Tag {
    // Инициализация из строки
    pub fn init_from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Tag {
            id: row.get("id")?,
            name: row.get("name")?,
            created_at: row.get("created_at")?,
            updated_at: row.get("updated_at")?,
        })
    }

    // Создание нового тега
    pub fn new(name: String) -> Self {
        let now = Utc::now().to_rfc3339();
        Tag {
            id: Uuid::new_v4(),
            name,
            created_at: now.clone(),
            updated_at: now,
        }
    }
}
