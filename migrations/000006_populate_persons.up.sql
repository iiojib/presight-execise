INSERT INTO persons (avatar_url, first_name, last_name, age, nationality_id)
SELECT
  'https://randomuser.me/api/portraits/' || (CASE WHEN floor(random() * 2) = 0 THEN 'men' ELSE 'women' END) || '/' || (floor(random() * 100))::int || '.jpg' AS avatar_url,
  (
    (ARRAY[
      'Liam','Noah','Oliver','Elijah','James','William','Benjamin','Lucas','Henry','Theodore','Jack','Levi','Alexander','Jackson','Mateo','Daniel','Michael','Mason','Sebastian','Ethan',
      'Logan','Owen','Samuel','Jacob','Asher','Aiden','John','Joseph','Wyatt','David','Leo','Luke','Julian','Hudson','Grayson','Matthew','Ezra','Gabriel','Carter','Isaac',
      'Jayden','Luca','Anthony','Dylan','Lincoln','Thomas','Maverick','Elias','Josiah','Charles','Caleb','Christopher','Ezekiel','Miles','Jaxon','Isaiah','Andrew','Joshua','Nathan',
      'Nolan','Adrian','Cameron','Santiago','Eli','Aaron','Ryan','Angel','Cooper','Waylon','Easton','Kai','Christian','Landon','Colton','Roman','Axel','Brooks','Jonathan','Robert',
      'Jameson','Ian','Everett','Greyson','Wesley','Jeremiah','Hunter','Leonardo','Jordan','Jose','Bennett','Silas','Nicholas','Parker','Beau','Weston','Connor','Austin','Evan','Micah','Ryder'
    ])[1 + floor(random() * 100)::int]
  ) AS first_name,
  (
    (ARRAY[
      'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin',
      'Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores',
      'Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts','Gomez','Phillips','Evans','Turner','Diaz','Parker','Cruz','Edwards','Collins','Reyes',
      'Stewart','Morris','Morales','Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper','Peterson','Bailey','Reed','Kelly','Howard','Ramos','Kim','Cox','Ward',
      'Richardson','Watson','Brooks','Chavez','Wood','James','Bennett','Gray','Mendoza','Ruiz','Hughes','Price','Alvarez','Castillo','Sanders','Patel','Myers','Long','Ross','Foster','Jimenez'
    ])[1 + floor(random() * 100)::int]
  ) AS last_name,
  16 + floor(random() * 65)::int AS age,
  (
    SELECT id
    FROM nationalities
    WHERE gs.i IS NOT NULL
    ORDER BY random()
    LIMIT 1
  ) AS nationality_id
FROM generate_series(1, 250) gs(i);
