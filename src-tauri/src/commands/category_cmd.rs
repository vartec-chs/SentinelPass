use crate::{
    dto::category_dto::{CategoryDto, CreateCategoryDto, UpdateCategoryDto},
    service::category_service::CategoryService,
    states::main_state::MainState,
};
use tauri::State;

#[tauri::command]
pub async fn create_category_command(
    state: State<'_, MainState>,
    dto: CreateCategoryDto,
) -> Result<CategoryDto, String> {
    let db_manager_mt = state.db_manager.lock();
    let db_manager = db_manager_mt.as_ref().unwrap();
    CategoryService::create(db_manager.get_connection(), dto)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_all_categories_command(
    state: State<'_, MainState>,
) -> Result<Vec<CategoryDto>, String> {
    let db_manager_mt = state.db_manager.lock();
    let db_manager = db_manager_mt.as_ref().unwrap();
    CategoryService::get_all(db_manager.get_connection())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_category_by_id_command(
    state: State<'_, MainState>,
    id: String,
) -> Result<Option<CategoryDto>, String> {
    let db_manager_mt = state.db_manager.lock();
    let db_manager = db_manager_mt.as_ref().unwrap();
    CategoryService::get_by_id(db_manager.get_connection(), id)
        .await
        .map_err(|e| e.to_string())
}

// #[tauri::command]
// pub async fn update_category_command(
//     state: State<'_, MainState>,
//     dto: UpdateCategoryDto,
// ) -> Result<(), String> {
//     let db_manager_mt = state.db_manager.lock();
//     let db_manager = db_manager_mt.as_ref().unwrap();
//     CategoryService::update(db_manager.get_connection(), dto)
//         .await
//         .map_err(|e| e.to_string())
// }

#[tauri::command]
pub async fn delete_category_command(
    state: State<'_, MainState>,
    id: String,
) -> Result<(), String> {
    let db_manager_mt = state.db_manager.lock();
    let db_manager = db_manager_mt.as_ref().unwrap();
    CategoryService::delete(db_manager.get_connection(), id)
        .await
        .map_err(|e| e.to_string())
}
