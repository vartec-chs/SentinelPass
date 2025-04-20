use crate::utils::cmd_result::{ApiError, ApiResult};
use crate::utils::icon_convert::image_to_base64_data_uri;
use tauri::command;

#[command]
pub async fn load_icon_base64(path: String) -> Result<ApiResult<String>, ApiResult<()>> {
    match image_to_base64_data_uri(path) {
        Ok(base64) => Ok(ApiResult::success(
            200,
            "Иконка конвертирована".to_string(),
            Some(base64),
        )),
        Err(e) => Err(ApiResult::error(
            ApiError::InternalError {
                code: 500,
                message: e.to_string(),
            },
            None,
        )),
    }
}
