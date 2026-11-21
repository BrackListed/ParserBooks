-- +goose Up
ALTER TABLE materials
ADD temporary BOOLEAN,
ADD temporary_id TEXT;
-- +goose Down
ALTER TABLE materials
DROP COLUMN temporary,
DROP COLUMN temporary_id;

