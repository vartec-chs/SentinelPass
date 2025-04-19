use std::{fs, path::Path, fmt};
use base64::{engine::general_purpose, Engine as _};

/// Возможные ошибки при загрузке иконки
#[derive(Debug)]
pub enum IconError {
    NoExtension,
    UnsupportedType(String),
    ReadError(std::io::Error),
}

impl fmt::Display for IconError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            IconError::NoExtension => write!(f, "Файл не имеет расширения."),
            IconError::UnsupportedType(ext) => write!(f, "Неподдерживаемый тип изображения: {}", ext),
            IconError::ReadError(e) => write!(f, "Ошибка чтения файла: {}", e),
        }
    }
}

impl From<std::io::Error> for IconError {
    fn from(err: std::io::Error) -> Self {
        IconError::ReadError(err)
    }
}

/// MIME по расширению
pub fn get_mime_type(ext: &str) -> Option<&'static str> {
    match ext.to_lowercase().as_str() {
        "png" => Some("image/png"),
        "jpg" | "jpeg" => Some("image/jpeg"),
        "gif" => Some("image/gif"),
        "webp" => Some("image/webp"),
        "svg" => Some("image/svg+xml"),
        _ => None,
    }
}

/// Преобразует путь к изображению в data:image/... base64
pub fn image_to_base64_data_uri<P: AsRef<Path>>(path: P) -> Result<String, IconError> {
    let p = path.as_ref();

    let ext = p
        .extension()
        .and_then(|s| s.to_str())
        .ok_or(IconError::NoExtension)?;

    let mime = get_mime_type(ext).ok_or_else(|| IconError::UnsupportedType(ext.to_string()))?;
    let blob = fs::read(p)?;

    let encoded = general_purpose::STANDARD.encode(blob);
    Ok(format!("data:{};base64,{}", mime, encoded))
}
