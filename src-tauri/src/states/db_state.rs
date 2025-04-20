use std::sync::{Arc, Mutex};

use crate::db::db_manager::DBManager;

pub struct DBState {
    pub db_manager: Arc<Mutex<DBManager>>,
}

impl Default for DBState {
    fn default() -> Self {
        Self {
            db_manager: Arc::new(Mutex::new(DBManager::default())),
        }
    }
}
