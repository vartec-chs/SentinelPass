use tauri::{LogicalSize, Manager, Size};

pub fn set_size_dashboard(handle: &tauri::AppHandle) {
    let window = handle.get_webview_window("main").unwrap();

    window.set_decorations(true).unwrap();

    match window.set_size(Size::Logical(LogicalSize {
        width: 1050.0,
        height: 600.0,
    })) {
        Ok(_) => {
            println!("Size set successfully");
        }
        Err(err) => {
            println!("Failed to set size: {}", err);
        }
    }

    window.set_decorations(false).unwrap();
    match window.set_min_size(Some(Size::Logical(LogicalSize {
        width: 550.0,
        height: 550.0,
    }))) {
        Ok(_) => println!("Min size set successfully"),
        Err(err) => println!("Failed to set min size: {}", err),
    }

    window.center().unwrap();
}

pub fn set_default_size(handle: &tauri::AppHandle) {
    let main_window = handle.get_webview_window("main").unwrap();

    main_window.set_decorations(true).unwrap();

    main_window
        .set_size(Size::Logical(LogicalSize {
            width: 800.0,
            height: 600.0,
        }))
        .unwrap();

    main_window.set_decorations(false).unwrap();
    match main_window.set_min_size(Some(Size::Logical(LogicalSize {
        width: 800.0,
        height: 600.0,
    }))) {
        Ok(_) => println!("Min size set successfully"),
        Err(err) => println!("Failed to set min size: {}", err),
    }

    main_window.center().unwrap();
}
