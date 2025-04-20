use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

use crate::utils::{
    cmd_result::{ApiError, ApiResult},
    password_generator::{generate_password, PasswordGeneratorCmd, PasswordResult},
};

#[tauri::command]
pub async fn open_password_generator_cmd(
    app: tauri::AppHandle,
) -> Result<ApiResult<()>, ApiResult<()>> {
    if app.get_webview_window("password-generator").is_some() {
        return Ok(ApiResult::error(
            ApiError::PasswordGeneratorError {
                code: 30,
                message: "Окно уже открыто".to_string(),
            },
            None,
        ));
    }

    let webview_url = WebviewUrl::App("/password-generator".into());
    let result = WebviewWindowBuilder::new(&app, "password-generator", webview_url)
        .title("Генератор паролей")
        .inner_size(400.0, 500.0)
        .decorations(false)
        .transparent(true)
        .resizable(false)
        .devtools(true) // Включаем DevTools
        .center()
        .always_on_top(false)
        .closable(true)
        .build();

    match result {
        Ok(_) => Ok(ApiResult::success(
            200,
            "Окно генератора паролей успешно открыто".to_string(),
            None,
        )),
        Err(e) => Err(ApiResult::error(
            ApiError::InternalError {
                code: 50,
                message: e.to_string(),
            },
            None,
        )),
    }
}

#[tauri::command]
pub fn close_password_generator_cmd(app: tauri::AppHandle) -> Result<ApiResult<()>, ApiResult<()>> {
    let window = app.get_webview_window("password_generator").unwrap();
    match window.set_visible_on_all_workspaces(false) {
        Ok(_) => Ok(ApiResult::success(
            200,
            "Окно генератора паролей успешно закрыто".to_string(),
            None,
        )),
        Err(e) => Err(ApiResult::error(
            ApiError::InternalError {
                code: 50,
                message: e.to_string(),
            },
            None,
        )),
    }
}

#[tauri::command]
pub async fn generate_password_cmd(
    dto: PasswordGeneratorCmd,
) -> Result<ApiResult<PasswordResult>, ApiResult<()>> {
    match generate_password(dto) {
        Ok(password) => Ok(ApiResult::success(
            200,
            "Пароль успешно сгенерирован".to_string(),
            Some(password),
        )),
        Err(e) => Err(ApiResult::error(
            ApiError::InternalError {
                code: 50,
                message: e.to_string(),
            },
            None,
        )),
    }
}
