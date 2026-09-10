-- +goose Up
CREATE TABLE quotations(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date TEXT,
    project TEXT,
    status TEXT,
    amount INT,
    reference TEXT,
    sent_via TEXT,
    notes TEXT,
    client TEXT,
    phone TEXT,
    email TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- +goose Down
SELECT 'down SQL query';
