use crate::db::db_manager::DbOpenError;
use crate::dto::db_store_dto::{CreateStoreDto, OpenStoreDto};
use crate::states::main_state::MainState;
use crate::utils::cmd_result::{ApiError, ApiResult};
use crate::utils::window_size::{set_default_size, set_size_dashboard};
use std::path::PathBuf;
use tauri::State;

#[tauri::command]
pub async fn create_store_cmd(
    app_handle: tauri::AppHandle,
    state: State<'_, MainState>,
    dto: CreateStoreDto,
) -> Result<ApiResult<()>, ApiResult<()>> {
    let path_buf = PathBuf::from(dto.path);

    // Инициализируем модель хранилища с базовыми данными
    let data = crate::db::models::password_storage::PasswordStorageModel::new(
        dto.name,
        dto.description,
        dto.master_password,
    );

    let db_manager_mt = state.db_manager.lock();
    let db_manager = db_manager_mt.as_ref().unwrap();
    match db_manager.create_sync(path_buf, data) {
        Ok(_) => {
            set_size_dashboard(&app_handle);
            Ok(ApiResult::success(
                200,
                "Хранилище успешно создано".to_string(),
                None,
            ))
        }
        Err(e) => Err(ApiResult::error(
            ApiError::DBError {
                code: 500,
                message: format!("Ошибка создания хранилища: {}", e),
            },
            None,
        )),
    }
}
#[tauri::command]
pub async fn open_store_cmd(
    app_handle: tauri::AppHandle,
    state: State<'_, MainState>,
    dto: OpenStoreDto,
) -> Result<ApiResult<()>, ApiResult<()>> {
    let path_buf = PathBuf::from(dto.path);
    if !path_buf.exists() {
        return Err(ApiResult::error(
            ApiError::DBError {
                code: 404,
                message: "Хранилище не найдено".to_string(),
            },
            None,
        ));
    }
    let db_manager_mt = state.db_manager.lock();
    let db_manager = db_manager_mt.as_ref().unwrap();
    match db_manager.open_sync(path_buf, dto.master_password) {
        Ok(_) => {
            set_size_dashboard(&app_handle);
            Ok(ApiResult::success(
                200,
                "Хранилище успешно открыто".to_string(),
                None,
            ))
        }
        Err(e) => match e {
            DbOpenError::Database(e) => Err(ApiResult::error(
                ApiError::DBError {
                    code: 500,
                    message: format!("Ошибка открытия хранилища: {}", e),
                },
                None,
            )),
            DbOpenError::InvalidKey => Err(ApiResult::error(
                ApiError::DBError {
                    code: 401,
                    message: "Неверный ключ шифрования".to_string(),
                },
                None,
            )),
            DbOpenError::TaskJoinError => Err(ApiResult::error(
                ApiError::InternalError {
                    code: 50,
                    message: "Ошибка выполнения задачи".to_string(),
                },
                None,
            )),
        },
    }
}

#[tauri::command]
pub async fn close_store_cmd(
    state: State<'_, MainState>,
    app_handle: tauri::AppHandle,
) -> Result<ApiResult<()>, ApiResult<()>> {
	let db_manager_mt = state.db_manager.lock();
    let db_manager = db_manager_mt.as_ref().unwrap();
    match db_manager.close_sync(&app_handle) {
        Ok(_) => {
            set_default_size(&app_handle);
            Ok(ApiResult::success(
                200,
                "Хранилище успешно закрыто".to_string(),
                None,
            ))
        }
        Err(e) => Err(ApiResult::error(
            ApiError::DBError {
                code: 500,
                message: format!("Ошибка закрытия хранилища: {}", e),
            },
            None,
        )),
    }
}
