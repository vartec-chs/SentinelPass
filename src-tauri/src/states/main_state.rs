use std::sync::Arc;
use tokio::sync::Mutex;

use crate::db::db_manager::DBManager;

pub struct MainState {
    pub db_manager: Arc<Mutex<DBManager>>,
}

impl MainState {
    pub fn default() -> Self {
        Self {
            db_manager: Arc::new(Mutex::new(DBManager::init())),
        }
    }
}
