use chrono::Utc;
use uuid::Uuid;
use rusqlite::Row;

#[derive(Debug, Clone)]
pub struct Password {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub is_favorite: bool,
    pub url: Option<String>,
    pub password: String,
    pub login: String,
    pub category_id: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl Password {
    /// Создаёт новый объект Password с автоматически сгенерированными id и временными метками.
    pub fn new(
        name: String,
        description: Option<String>,
        is_favorite: bool,
        url: Option<String>,
        password: String,
        login: String,
        category_id: Option<String>,
    ) -> Self {
        let now = Utc::now().to_rfc3339();
        Password {
            id: Uuid::new_v4().to_string(),
            name,
            description,
            is_favorite,
            url,
            password,
            login,
            category_id,
            created_at: now.clone(),
            updated_at: now,
        }
    }

    /// Инициализирует объект Password из строки, возвращаемой запросом.
    pub fn init_from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Password {
            id: row.get("id")?,
            name: row.get("name")?,
            description: row.get("description").ok(),
            // is_favorite хранится как INTEGER (0 или 1)
            is_favorite: row.get::<_, i32>("is_favorite")? != 0,
            url: row.get("url").ok(),
            password: row.get("password")?,
            login: row.get("login")?,
            category_id: row.get("category_id").ok(),
            created_at: row.get("created_at")?,
            updated_at: row.get("updated_at")?,
        })
    }
}
