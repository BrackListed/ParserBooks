-- +goose Up
CREATE TYPE priority_type AS ENUM('Low', 'Moderate', 'High');
CREATE TYPE status_type AS ENUM('Unpaid', 'Paid');
CREATE TABLE bills(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    due TEXT,
    supplier TEXT,
    description TEXT,
    amount INT,
    priority priority_type NOT NULL DEFAULT 'Moderate',
    status status_type NOT NULL DEFAULT 'Unpaid',
    paid_date TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- +goose Down
DROP TYPE IF EXISTS priority_type;
DROP TYPE IF EXISTS status_type ;
DROP TABLE IF EXISTS bills;
