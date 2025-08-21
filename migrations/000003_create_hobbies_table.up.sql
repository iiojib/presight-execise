CREATE TABLE IF NOT EXISTS hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS person_hobbies (
  person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  hobby_id UUID NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
  PRIMARY KEY (person_id, hobby_id)
);

CREATE UNIQUE INDEX idx_hobbies_name ON hobbies(lower(name));
CREATE INDEX idx_person_hobbies_hobby_id ON person_hobbies(hobby_id);
