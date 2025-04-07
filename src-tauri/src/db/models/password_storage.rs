use chrono::Utc;
use uuid::Uuid;

#[derive(Debug)]
pub struct PasswordStorageModel {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub master_password: String,
    pub created_at: String,
    pub updated_at: Option<String>,
}

impl PasswordStorageModel {
    pub fn new(name: String, description: Option<String>, master_password: String) -> Self {
        let created_at = Utc::now().to_rfc3339();
 

        Self {
            id: Uuid::new_v4(),
            name,
            description,
            master_password,
            created_at,
            updated_at: None,
        }
    }

    pub fn init(
        id: Uuid,
        name: String,
        description: Option<String>,
        master_password: String,
        created_at: String,
        updated_at: Option<String>,
    ) -> Self {
        Self {
            id,
            name,
            description,
            master_password,
            created_at,
            updated_at,
        }
    }
}
