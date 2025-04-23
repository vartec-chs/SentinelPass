use tauri::{command, AppHandle, Manager, WebviewUrl, WebviewWindow};

#[command]
pub fn test_window_cmd(app: tauri::AppHandle) -> Result<(), String> {
    let webview_url = WebviewUrl::App("/password-generator".into());



    // Создаем билдер окна
    let builder = WebviewWindow::builder(&app, "password-generator", webview_url)
        .title("Password Generator")
        .inner_size(600.0, 400.0); // Пример настройки окна

    // Вызываем build для создания окна
    match builder.build() {
        Ok(_window) => Ok(()),        // Окно успешно создано
        Err(e) => Err(e.to_string()), // Ошибка при создании окна
    }
}
