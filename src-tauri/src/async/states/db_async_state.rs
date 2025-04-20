use std::sync::Arc;
use tokio::sync::Mutex;

use crate::db::db_manager_async::DBManager;

pub struct DBAsyncState {
    pub db_manager: Arc<Mutex<DBManager>>,
}

impl Default for DBAsyncState {
    fn default() -> Self {
        Self {
            db_manager: Arc::new(Mutex::new(DBManager::init())),
        }
    }
}
