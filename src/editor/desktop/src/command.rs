use tauri::Result;

#[tauri::command]
pub fn print_app_info(app: tauri::AppHandle, window: tauri::Window) -> Result<()> {
    let app_dir = app.path_resolver().app_dir();

    println!("Window: {}", window.label());
    println!("app dir: {:?}", app_dir.unwrap());

    Ok(())
}