// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate sys_info;

use sys_info::{mem_info, loadavg };

#[derive(Debug)] 
struct SystemInfo {
  memory_total : u64,
  load_average:f64,
}

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn info() -> String {
  format!("{:?}", get_system_info())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet, info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}


fn get_system_info() -> SystemInfo {
  // memory info
  let mem_info = mem_info().unwrap();
  let memory_total = mem_info.total;
  // Información de carga promedio
  let load_avg = loadavg().unwrap();
  let load_average = load_avg.one;

  SystemInfo { memory_total, load_average }
}