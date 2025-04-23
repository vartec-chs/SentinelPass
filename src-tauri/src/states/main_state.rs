use std::sync::{Arc, Mutex, MutexGuard};

use tauri_plugin_stronghold::stronghold::Stronghold;

pub struct MainState {
    stronghold: Arc<Mutex<Option<Stronghold>>>,
}

impl Default for MainState {
    fn default() -> Self {
        Self {
            stronghold: Arc::new(Mutex::new(None)),
        }
    }
}

impl MainState {
    pub fn get_stronghold(&self) -> MutexGuard<'_, Option<Stronghold>> {
        self.stronghold.lock().unwrap()
    }

    pub fn set_stronghold(&self, stronghold: Option<Stronghold>) {
        *self.stronghold.lock().unwrap() = stronghold;
    }
}
