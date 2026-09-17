-- +goose Up
CREATE TABLE employees(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    employee TEXT,
    normal_rate NUMERIC DEFAULT 25.99,
    ot_rate NUMERIC DEFAULT 38.98,
    payg INT DEFAULT 19,
    super INT DEFAULT 11
);

-- +goose Down
DROP TABLE IF EXISTS employees
