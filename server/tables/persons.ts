import type { Generated } from "kysely";

export type PersonsTableSchema = {
  id: Generated<string>;
  avatar_url: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality_id: string;
};
