-- +goose Up
CREATE TYPE labour_type AS ENUM('Normal', 'Overtime');
CREATE TABLE labour(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    project_id UUID REFERENCES projects(id) NOT NULL,
    date DATE,
    employee TEXT,
    type labour_type NOT NULL DEFAULT 'Normal',
    from_time TEXT,
    to_time TEXT,
    hours INT,
    total NUMERIC,
    notes TEXT
);
-- +goose Down
DROP TABLE IF EXISTS labour;
DROP TYPE IF EXISTS labour_type;