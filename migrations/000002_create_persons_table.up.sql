CREATE TABLE IF NOT EXISTS persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avatar_url VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  nationality_id UUID NOT NULL REFERENCES nationalities(id)
);

CREATE INDEX idx_persons_nationality_id ON persons(nationality_id);
CREATE INDEX idx_persons_first_name ON persons(lower(first_name));
CREATE INDEX idx_persons_last_name ON persons(lower(last_name));
