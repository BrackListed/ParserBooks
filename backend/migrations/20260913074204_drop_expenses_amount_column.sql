-- +goose Up
ALTER TABLE expenses
DROP COLUMN amount;
-- +goose Down
ALTER TABLE expenses
ADD amount int;