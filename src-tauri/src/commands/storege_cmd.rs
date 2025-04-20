use crate::db::db_manager::DBManagerError;
use crate::dto::db_store_dto::{CreateStoreDto, OpenStoreDto};
use crate::states::db_state::DBState;

use crate::utils::cmd_result::{ApiError, ApiResult};
use crate::utils::window_size::{set_default_size, set_size_dashboard};
use std::path::PathBuf;
use tauri::State;

/// Универсальная функция для обработки ошибок
fn handle_db_error<T>(
    db_manager_result: Result<T, DBManagerError>,
    success_msg: &str,
    error_msg: &str,
    code: u16,
    app_handle: &tauri::AppHandle,
    is_close: Option<bool>,
) -> Result<ApiResult<()>, ApiResult<()>> {
    match db_manager_result {
        Ok(_) => {
            if let Some(true) = is_close {
                set_default_size(app_handle);
            } else {
                set_size_dashboard(app_handle);
            }
            Ok(ApiResult::success(200, success_msg.to_string(), None))
        }
        Err(e) => {
            let api_error = match e {
                DBManagerError::Database(err) => ApiError::DBError {
                    code,
                    message: format!("{}: {}", error_msg, err),
                },
                DBManagerError::InvalidKey => ApiError::DBError {
                    code: 401,
                    message: "Неверный ключ шифрования".to_string(),
                },
            };
            Err(ApiResult::error(api_error, None))
        }
    }
}

#[tauri::command]
pub fn create_store_cmd(
    app_handle: tauri::AppHandle,
    state: State<'_, DBState>, // изменено на синхронное состояние
    dto: CreateStoreDto,
) -> Result<ApiResult<()>, ApiResult<()>> {
    let path_buf = PathBuf::from(dto.path);

    // Инициализируем модель хранилища с базовыми данными
    let data = crate::db::models::password_storage::PasswordStorageModel::new(
        dto.name,
        dto.description,
        dto.master_password,
    );

    let mut db_manager = state.db_manager.lock().unwrap(); // синхронный доступ

    handle_db_error(
        db_manager.create(path_buf, data),
        "Хранилище успешно создано",
        "Ошибка создания хранилища",
        500,
        &app_handle,
        None,
    )
}

#[tauri::command]
pub fn open_store_cmd(
    app_handle: tauri::AppHandle,
    state: State<'_, DBState>, // изменено на синхронное состояние
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

    let mut db_manager = state.db_manager.lock().unwrap(); // синхронный доступ
    handle_db_error(
        db_manager.open(path_buf, dto.master_password),
        "Хранилище успешно открыто",
        "Ошибка открытия хранилища",
        500,
        &app_handle,
        None,
    )
}

#[tauri::command]
pub fn close_store_cmd(
    state: State<'_, DBState>, // изменено на синхронное состояние
    app_handle: tauri::AppHandle,
) -> Result<ApiResult<()>, ApiResult<()>> {
    let mut db_manager = state.db_manager.lock().unwrap(); // синхронный доступ

    handle_db_error(
        db_manager.close(&app_handle),
        "Хранилище успешно закрыто",
        "Ошибка закрытия хранилища",
        500,
        &app_handle,
        Some(true),
    )
}
