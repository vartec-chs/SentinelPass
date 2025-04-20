// use crate::{
//     db::db_manager::DBManager,
//     dto::category_dto::{CategoryDto, CreateCategoryDto},
//     services::category_service::CategoryService,
//     utils::cmd_result::{handle_command, ApiError, ApiResult},
// };
// use tauri::{command, State};

// #[command]
// pub fn create_category_command(
//     state: State<'_, DBManager>,
//     dto: CreateCategoryDto,
// ) -> ApiResult<CategoryDto> {
//     handle_command(|| {
//         let conn_result = state.with_connection(|conn| {
//             CategoryService::create(conn, dto).map_err(|e| ApiError::DBError {
//                 code: 1,
//                 message: e.to_string(),
//             })
//         });

//         conn_result.map_err(|e| ApiError::DBError {
//             code: 2,
//             message: e.to_string(),
//         })?
//     })
// }
