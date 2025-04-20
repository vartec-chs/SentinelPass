use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApiResult<T> {
    pub is_success: bool,
    pub status_code: u32,
    pub message: String,
    pub data: Option<T>,
}

impl<T> ApiResult<T> {
    /// Универсальный конструктор для ApiResult
    fn new(
        is_success: bool,
        status_code: u32,
        message: impl Into<String>,
        data: Option<T>,
    ) -> Self {
        Self {
            is_success,
            status_code,
            message: message.into(),
            data,
        }
    }

    /// Успешный ответ с кастомным кодом.
    /// Здесь передаётся числовой код, который форматируется с префиксом успеха (2).
    pub fn success(code: u16, message: impl Into<String>, data: Option<T>) -> Self {
        Self::new(true, format_status_code(2, code), message, data)
    }

    /// Ответ с ошибкой, в который можно передать полезные данные.
    pub fn error(error: ApiError, data: Option<T>) -> Self {
        Self::new(false, error.status_code(), error.to_string(), data)
    }
}

/// Функция для формирования полного кода: конкатенирует префикс и код
fn format_status_code(prefix: u8, code: u16) -> u32 {
    let full_code = format!("{}{}", prefix, code);
    full_code.parse().unwrap_or(0)
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ApiError {
    /// Ошибка базы данных
    #[serde(rename_all = "camelCase")]
    DBError { code: u16, message: String },
    /// Ошибка валидации
    #[serde(rename_all = "camelCase")]
    ValidationError { code: u16, message: String },
    /// Не найдено
    #[serde(rename_all = "camelCase")]
    NotFound { code: u16, message: String },
    /// Внутренняя ошибка
    #[serde(rename_all = "camelCase")]
    InternalError { code: u16, message: String },
    /// Ошибка доступа
    #[serde(rename_all = "camelCase")]
    AccessError { code: u16, message: String },

    #[serde(rename_all = "camelCase")]
    PasswordGeneratorError { code: u16, message: String },
}

impl ApiError {
    /// Генерация кода ошибки с использованием своего префикса
    pub fn status_code(&self) -> u32 {
        match self {
            ApiError::DBError { code, .. } => format_status_code(42, *code),
            ApiError::ValidationError { code, .. } => format_status_code(50, *code),
            ApiError::NotFound { code, .. } => format_status_code(40, *code),
            ApiError::InternalError { code, .. } => format_status_code(43, *code),
            ApiError::AccessError { code, .. } => format_status_code(41, *code),

            ApiError::PasswordGeneratorError { code, .. } => format_status_code(51, *code),
        }
    }
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ApiError::DBError { message, .. } => write!(f, "Ошибка БД: {}", message),
            ApiError::ValidationError { message, .. } => write!(f, "Ошибка валидации: {}", message),
            ApiError::NotFound { message, .. } => write!(f, "Не найдено: {}", message),
            ApiError::InternalError { message, .. } => write!(f, "Неизвестная ошибка: {}", message),
            ApiError::AccessError { message, .. } => write!(f, "Ошибка доступа: {}", message),

            ApiError::PasswordGeneratorError { message, .. } => {
                write!(f, "Ошибка генератора паролей: {}", message)
            }
        }
    }
}

pub fn handle_command<T, F>(f: F) -> ApiResult<T>
where
    F: FnOnce() -> Result<T, ApiError> + std::panic::UnwindSafe,
{
    match std::panic::catch_unwind(f) {
        Ok(Ok(data)) => ApiResult::success(0, "Успешно", Some(data)),
        Ok(Err(err)) => ApiResult::error(err, None),
        Err(_) => ApiResult::error(
            ApiError::InternalError {
                code: 1,
                message: "Неожиданная ошибка (panic)".into(),
            },
            None,
        ),
    }
}
