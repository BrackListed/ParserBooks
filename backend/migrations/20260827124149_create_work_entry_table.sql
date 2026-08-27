-- +goose Up
CREATE TYPE work_entry_type AS ENUM('Normal', 'Overtime');
CREATE TABLE work_entry(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    worker TEXT NOT NULL,
    project_name TEXT,
    type work_entry_type NOT NULL DEFAULT 'Normal',
    hours INT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- +goose Down
DROP TABLE IF EXISTS work_entry;
DROP TYPE IF EXISTS work_entry_type;