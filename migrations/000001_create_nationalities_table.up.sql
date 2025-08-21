CREATE TABLE IF NOT EXISTS nationalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL
);

CREATE UNIQUE INDEX idx_nationalities_name ON nationalities(lower(name));
