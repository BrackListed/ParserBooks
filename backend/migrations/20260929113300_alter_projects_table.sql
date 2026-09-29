-- +goose Up
ALTER TABLE projects
ADD material_markup INT,
ADD labour_markup INT;
-- +goose Down
ALTER TABLE projects
DROP COLUMN material_markup,
DROP COLUMN labour_markup;