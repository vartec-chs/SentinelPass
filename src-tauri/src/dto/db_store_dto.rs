use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateStoreDto {
    pub name: String,
    pub path: String,
    pub description: Option<String>,
    pub master_password: String,
}


#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenStoreDto {
    pub path: String,
    pub master_password: String,
}
