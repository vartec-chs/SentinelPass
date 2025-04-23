use commands::*;
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
        .manage(DBState::default())
        .plugin(
            tauri_plugin_stronghold::Builder::new(|password| {
                // Hash the password here with e.g. argon2, blake2b or any other secure algorithm
                // Here is an example implementation using the `rust-argon2` crate for hashing the password
                use argon2::{
                    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
                    Argon2,
                };

                let salt = SaltString::generate(&mut OsRng);
                let argon2 = Argon2::default();
                let key = argon2
                    .hash_password(password.as_ref(), &salt)
                    .expect("failed to hash password");

                if let Some(key) = key.hash {
                    key.as_bytes().to_vec()
                } else {
                    panic!("failed to hash password");
                }
            })
            .build(),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // DB
            storage_cmd::create_store_cmd,
            storage_cmd::open_store_cmd,
            storage_cmd::close_store_cmd,
            // Password generator
            password_generator_cmd::generate_password_cmd,
            password_generator_cmd::open_password_generator_cmd,
            password_generator_cmd::close_password_generator_cmd,
            // Icon generator
            icon_cmd::load_icon_base64,
            // Test
            test::test_window_cmd,
        ])
        .run(tauri::generate_context!())
        .expect("Error running tauri application");
}
