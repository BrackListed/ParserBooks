-- +goose Up
CREATE TABLE maintenance(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    property TEXT,
    client TEXT,
    type TEXT, 
    frequency TEXT NOT NULL DEFAULT 'Monthly',
    next_due TEXT,
    assigned TEXT,
    status TEXT NOT NULL DEFAULT 'Upcoming',
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- +goose Down
DROP TABLE IF EXISTS maintenance;