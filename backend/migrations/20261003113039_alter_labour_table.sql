-- +goose Up
ALTER TABLE labour
ALTER COLUMN id DROP DEFAULT;

-- +goose Down
ALTER TABLE labour
ALTER COLUMN id SET DEFAULT gen_random_uuid();
