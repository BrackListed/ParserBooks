-- +goose Up
CREATE TYPE category_type AS ENUM('Fuel', 'Admin', 'Tools', 'Insurance', 'Other');
CREATE TYPE type_gst AS ENUM('Inc GST', 'Ex GST');
CREATE TABLE expenses(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date TEXT,
    project TEXT, 
    category category_type NOT NULL DEFAULT 'Fuel',
    supplier TEXT,
    description TEXT,
    amount INT,
    gst_type type_gst NOT NULL DEFAULT 'Inc GST',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- +goose Down
DROP TYPE IF EXISTS category_type;
DROP TYPE IF EXISTS type_gst;
DROP TABLE IF EXISTS expenses;