import type { Generated } from "kysely";

export type HobbiesTableSchema = {
  id: Generated<string>;
  name: string;
};

export type PersonHobbiesTableSchema = {
  person_id: string;
  hobby_id: string;
};
