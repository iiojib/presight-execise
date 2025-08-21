INSERT INTO person_hobbies (person_id, hobby_id)
SELECT person_id, hobby_id
FROM (
    SELECT DISTINCT ON (p.id, seq.n)
        p.id AS person_id,
        hobbies.id AS hobby_id
    FROM (
        SELECT id, (random() * 11)::int AS rand_limit
        FROM persons
    ) p
    JOIN (SELECT generate_series(1, 10) AS n) seq ON seq.n <= p.rand_limit
    CROSS JOIN hobbies
    ORDER BY p.id, seq.n, random()
)
ON CONFLICT (person_id, hobby_id) DO NOTHING;
