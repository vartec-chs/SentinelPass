use crate::db::models::tag::Tag;
use crate::dto::tag_dto::{CreateTagDto, TagDto, UpdateTagDto};
use anyhow::{anyhow, Error, Result};
use rusqlite::{params, Connection};
use std::sync::{Arc, Mutex};

pub struct TagService;

impl TagService {
    // Получение всех тегов
    pub async fn get_all_tags(conn: Arc<Mutex<Connection>>) -> Result<Vec<TagDto>> {
        let conn = Arc::clone(&conn);

        let tags_result: Result<Vec<TagDto>> = tokio::task::spawn_blocking(move || {
            let conn = conn
                .lock()
                .map_err(|e| anyhow!("Mutex poison error: {}", e))?;

            let mut stmt = conn.prepare("SELECT * FROM tags")?;
            let mut rows = stmt.query([])?;

            let mut tags = Vec::new();
            while let Some(row) = rows.next()? {
                let tag = Tag::init_from_row(&row)?;
                tags.push(TagDto {
                    id: tag.id.to_string(),
                    name: tag.name,
                });
            }

            Ok(tags)
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?;

        Ok(tags_result?)
    }

    // Получение тега по ID
    pub async fn get_tag_by_id(conn: Arc<Mutex<Connection>>, id: String) -> Result<Option<TagDto>> {
        let conn = Arc::clone(&conn);

        let result: Result<Option<TagDto>> = tokio::task::spawn_blocking(move || {
            let conn = conn
                .lock()
                .map_err(|e| anyhow!("Mutex poison error: {}", e))?;

            let mut stmt = conn.prepare("SELECT * FROM tags WHERE id = ?")?;
            let mut rows = stmt.query(params![id])?;

            if let Some(row) = rows.next()? {
                let tag = Tag::init_from_row(&row)?;
                Ok(Some(TagDto {
                    id: tag.id.to_string(),
                    name: tag.name,
                }))
            } else {
                Ok(None)
            }
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?;

        Ok(result?)
    }

    // Создание нового тега
    pub async fn create_tag(conn: Arc<Mutex<Connection>>, dto: CreateTagDto) -> Result<TagDto> {
        let conn = Arc::clone(&conn);

        let tag_result: Result<TagDto> = tokio::task::spawn_blocking(move || {
            let conn = conn.lock().map_err(|e| anyhow!("Mutex error: {}", e))?;

            let tag = Tag::new(dto.name);
            conn.execute(
                "INSERT INTO tags (id, name) VALUES (?, ?)",
                params![tag.id.to_string(), tag.name],
            )?;

            Ok(TagDto {
                id: tag.id.to_string(),
                name: tag.name,
            })
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?; // <- обрабатываем JoinError

        Ok(tag_result?) // <- здесь уже точно Result<TagDto>
    }

    // Обновление существующего тега
    pub async fn update_tag(
        conn: Arc<Mutex<Connection>>,
        update_tag_dto: UpdateTagDto,
    ) -> Result<TagDto> {
        let conn = Arc::clone(&conn);

        let result: Result<TagDto> = tokio::task::spawn_blocking(move || {
            let conn = conn
                .lock()
                .map_err(|e| anyhow!("Mutex poison error: {}", e))?;

            conn.execute(
                "UPDATE tags SET name = ? WHERE id = ?",
                params![update_tag_dto.name, update_tag_dto.id],
            )?;

            Ok(TagDto {
                id: update_tag_dto.id,
                name: update_tag_dto.name,
            })
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?;

        Ok(result?)
    }

    // Удаление тега
    pub async fn delete_tag(conn: Arc<Mutex<Connection>>, id: String) -> Result<()> {
        let conn = Arc::clone(&conn);

        let result: Result<()> = tokio::task::spawn_blocking(move || {
            let conn = conn
                .lock()
                .map_err(|e| anyhow!("Mutex poison error: {}", e))?;

            conn.execute("DELETE FROM tags WHERE id = ?", params![id])?;
            Ok(())
        })
        .await
        .map_err(|e| anyhow!("Tokio join error: {}", e))?;

        Ok(result?)
    }
}
