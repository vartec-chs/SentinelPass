use rand::{rng, Rng};
use serde::{Deserialize, Serialize};

/// Данные, которые приходят с фронта
#[derive(Debug, Deserialize)]
pub struct CharacterSetInput {
    pub enabled: bool,
    pub value: String,
}

#[derive(Debug, Deserialize)]
pub struct PasswordGeneratorCmd {
    pub symbols: CharacterSetInput,
    pub uppercase: CharacterSetInput,
    pub lowercase: CharacterSetInput,
    pub digits: CharacterSetInput,
    pub length: usize,
}

/// Результат генерации пароля
#[derive(Debug, Serialize)]
pub struct PasswordResult {
    pub password: String,
    pub complexity: f32,        // 0-100
    pub strength_label: String, // Текстовая оценка
}

/// Генерация пароля и оценка его сложности
pub fn generate_password(
    dto: PasswordGeneratorCmd,
) -> Result<PasswordResult, String> {
    let mut available_chars = String::new();

    if dto.symbols.enabled {
        available_chars.push_str(&dto.symbols.value);
    }
    if dto.uppercase.enabled {
        available_chars.push_str(&dto.uppercase.value);
    }
    if dto.lowercase.enabled {
        available_chars.push_str(&dto.lowercase.value);
    }
    if dto.digits.enabled {
        available_chars.push_str(&dto.digits.value);
    }

    if available_chars.is_empty() {
        return Err("Нет доступных символов для генерации пароля!".into());
    }

    let chars: Vec<char> = available_chars.chars().collect();
    let mut rng = rng();
    let password: String = (0..dto.length)
        .map(|_| chars[rng.random_range(0..chars.len())])
        .collect();

    let complexity = estimate_password_complexity(&password, chars.len());
    let strength_label = get_strength_label(complexity);

    Ok(PasswordResult {
        password,
        complexity,
        strength_label,
    })
}

/// Оценка сложности пароля
fn estimate_password_complexity(password: &str, charset_size: usize) -> f32 {
    let length = password.len() as f32;
    let charset_size = charset_size as f32;

    if charset_size <= 1.0 {
        return 0.0;
    }

    // Энтропия пароля (бит)
    let entropy = length * charset_size.log2();

    // Максимальная разумная энтропия (100-битный пароль - супернадёжный)
    let max_entropy = 100.0;

    // Рассчитываем сложность (0-100%), но нормализуем её
    let complexity = (entropy / max_entropy) * 100.0;

    // Минимум 5%, максимум 100%
    complexity.clamp(5.0, 100.0)
}

/// Генерация лейбла сложности по шкале
fn get_strength_label(complexity_score: f32) -> String {
    match complexity_score as u32 {
        0..=20 => "Очень слабый",
        21..=50 => "Слабый",
        51..=80 => "Средний",
        81..=95 => "Надежный",
        _ => "Очень надежный",
    }
    .to_string()
}
