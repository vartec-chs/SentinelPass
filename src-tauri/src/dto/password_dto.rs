use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PasswordDto {
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatePasswordDto {
    pub name: String,
    pub description: Option<String>,
    // Можно передавать isFavorite, если нет – считается false
    pub is_favorite: Option<bool>,
    pub url: Option<String>,
    pub password: String,
    pub login: String,
    pub category_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdatePasswordDto {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub is_favorite: Option<bool>,
    pub url: Option<String>,
    pub password: String,
    pub login: String,
    pub category_id: Option<String>,
}
