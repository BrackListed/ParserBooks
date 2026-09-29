-- +goose Up
CREATE TYPE billing AS ENUM('Standard Charge', 'Contract', 'Cost Plus');
CREATE TABLE projects(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT,
    client TEXT,
    address TEXT,
    billing_type billing NOT NULL DEFAULT 'Standard Charge',
    contract_amount INT,
    initial_variation INT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- +goose Down
DROP TYPE IF EXISTS billing;
DROP TABLE IF EXISTS projects;
