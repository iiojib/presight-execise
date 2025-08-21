import type { Kysely } from "kysely";

import type {
  HobbyListSort,
  NationalityListSort,
  PersonListParameters,
  PersonsRepository as PersonsRepositoryInterface,
} from "../app/persons.ts";

import type { PaginationQueryParameters } from "../libs/pagination.ts";
import type { PersonsTableSchema } from "../tables/persons.ts";
import type { NationalitiesTableSchema } from "../tables/nationalities.ts";
import type { HobbiesTableSchema, PersonHobbiesTableSchema } from "../tables/hobbies.ts";
import type { Person } from "../models/person.ts";

export type PersonsDBSchema = {
  persons: PersonsTableSchema;
  nationalities: NationalitiesTableSchema;
  hobbies: HobbiesTableSchema;
  person_hobbies: PersonHobbiesTableSchema;
};

export class PersonsRepository implements PersonsRepositoryInterface {
  private db: Kysely<PersonsDBSchema>;

  constructor(db: Kysely<PersonsDBSchema>) {
    this.db = db;
  }

  async listPersons(params: PersonListParameters & PaginationQueryParameters): Promise<Person[]> {
    let personsQuery = this.db.selectFrom("persons")
      .leftJoin("nationalities", "persons.nationality_id", "nationalities.id")
      .select([
        "persons.id",
        "persons.avatar_url",
        "persons.first_name",
        "persons.last_name",
        "persons.age",
        "nationalities.name as nationality",
      ])
      .limit(params.limit)
      .offset((params.page - 1) * params.limit);

    const search = params.search?.trim();

    if (search) {
      const terms = search.split(/\s+/);

      personsQuery = personsQuery.where((eb) => eb.and(
        terms.map((term) => eb.or([
          eb("first_name", "ilike", `%${term}%`),
          eb("last_name", "ilike", `%${term}%`),
        ]))
      ));
    }

    if (params.nationalities?.length) {
      const nationalities = Array.isArray(params.nationalities) ? params.nationalities : [params.nationalities];

      personsQuery = personsQuery.where(this.db.fn("lower", ["nationalities.name"]), "in", nationalities.map((name) => name.toLowerCase()));
    }

    if (params.hobbies?.length) {
      const subQuery = this.db.selectFrom("person_hobbies")
        .innerJoin("hobbies", "person_hobbies.hobby_id", "hobbies.id")
        .select("person_hobbies.person_id");

      const hobbies = Array.isArray(params.hobbies) ? params.hobbies : [params.hobbies];

      personsQuery = personsQuery.where(
        "persons.id",
        "in",
        subQuery.where(this.db.fn("lower", ["hobbies.name"]), "in", hobbies.map((name) => name.toLowerCase()))
      );
    }

    const personRows = await personsQuery.execute();

    if (!personRows.length) {
      return [];
    }

    const hobbiesQuery = this.db.selectFrom("hobbies")
      .innerJoin("person_hobbies", "hobbies.id", "person_hobbies.hobby_id")
      .select([
        "hobbies.name",
        "person_hobbies.person_id",
      ])
      .where("person_hobbies.person_id", "in", personRows.map((row) => row.id));

    const hobbyRows = await hobbiesQuery.execute();

    const personHobbiesMap = hobbyRows.reduce((acc, row) => {
      if (!acc.has(row.person_id)) {
        acc.set(row.person_id, []);
      }

      acc.get(row.person_id)?.push(row.name);

      return acc;
    }, new Map<string, string[]>());

    const persons = personRows.map((row) => ({
      id: row.id,
      avatar: row.avatar_url,
      first_name: row.first_name,
      last_name: row.last_name,
      age: row.age,
      nationality: String(row.nationality),
      hobbies: personHobbiesMap.get(row.id) ?? [],
    }));

    return persons;
  }

  async listNationalities(params: PaginationQueryParameters & NationalityListSort): Promise<string[]> {
    let query = this.db.selectFrom("nationalities")
      .select("name")
      .limit(params.limit)
      .offset((params.page - 1) * params.limit);

    if (params.sortByCount) {
      query = query.innerJoin(
        (eb) => eb.selectFrom("persons")
          .select(["persons.nationality_id", eb.fn.countAll().as("rating")])
          .groupBy("persons.nationality_id")
          .as("rating"),
        (join) => join.onRef("nationalities.id", "=", "rating.nationality_id")
        )
        .orderBy("rating.rating", "desc");
    }

    const rows = await query.execute();

    return rows.map((row) => row.name);
  }

  async listHobbies(params: PaginationQueryParameters & HobbyListSort): Promise<string[]> {
    let query = this.db.selectFrom("hobbies")
      .select("name")
      .limit(params.limit)
      .offset((params.page - 1) * params.limit);

    if (params.sortByCount) {
      query = query.innerJoin(
        (eb) => eb.selectFrom("person_hobbies")
          .select(["person_hobbies.hobby_id", eb.fn.countAll().as("rating")])
          .groupBy("person_hobbies.hobby_id")
          .as("rating"),
        (join) => join.onRef("hobbies.id", "=", "rating.hobby_id")
      ).orderBy("rating.rating", "desc");
    }

    const rows = await query.execute();

    return rows.map((row) => row.name);
  }
}
