CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS task (
    id uuid DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ default now(),
    updated_at TIMESTAMPTZ,
    description VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON task
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();