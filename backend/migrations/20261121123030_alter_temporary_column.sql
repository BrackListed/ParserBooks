-- +goose Up
ALTER TABLE materials
ALTER COLUMN temporary SET DEFAULT TRUE;
-- +goose Down
ALTER TABLE materials
ALTER COLUMN temporary DROP DEFAULT;