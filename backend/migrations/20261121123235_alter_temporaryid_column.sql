-- +goose Up
ALTER TABLE materials
DROP COLUMN temporary_id,
ADD temporary_id UUID;
-- +goose Down
ALTER TABLE materials
ADD temporary_id TEXT,
DROP COLUMN temporary_id;
