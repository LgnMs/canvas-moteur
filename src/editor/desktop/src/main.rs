#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod command;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![command::print_app_info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
