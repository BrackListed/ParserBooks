-- +goose Up
CREATE TABLE materials(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id),
    supplier TEXT,
    invoice TEXT,
    product_code TEXT,
    quantity INT,
    description TEXT,
    unit_price NUMERIC,
    net_price NUMERIC,
    gst NUMERIC,
    total NUMERIC,
    date DATE
);
-- +goose Down
DROP TABLE IF EXISTS materials;
