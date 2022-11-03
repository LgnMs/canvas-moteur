#[tauri::command]
fn open_file(name: &str) -> String {
    let mut file = File::open(name)?;
}