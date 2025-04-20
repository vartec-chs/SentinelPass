use serde::{Deserialize, Serialize};

use crate::db::models::category::Category;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CategoryDto {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateCategoryDto {
    pub name: String,
    pub description: Option<String>,
    pub icon: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCategoryDto {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub icon: Option<String>,
}

impl From<CategoryDto> for Category {
    fn from(dto: CategoryDto) -> Self {
        Category {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            icon: dto.icon,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        }
    }
}
