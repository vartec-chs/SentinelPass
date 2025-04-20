// use commands::{db_store_cmd, icon_cmd, password_generator_cmd};

// use states::{db_async_state::DBAsyncState, main_state::MainState};

use states::db_state::DBState;

pub mod commands;
pub mod db;
pub mod dto;
pub mod services;
pub mod states;
pub mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    tauri::Builder::default()
        // .manage(MainState::default())
        // .manage(DBAsyncState::default())
        .manage(DBState::default())
        .plugin(tauri_plugin_stronghold::Builder::new(|_| todo!()).build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // db_store_cmd::create_store_cmd,
            // db_store_cmd::open_store_cmd,
            // db_store_cmd::close_store_cmd,
            // password_generator_cmd::generate_password_cmd,
            // password_generator_cmd::open_password_generator_cmd,
            // password_generator_cmd::close_password_generator_cmd,
            // icon_cmd::load_icon_base64
        ])
        .run(tauri::generate_context!())
        .expect("Error running tauri application");
}
