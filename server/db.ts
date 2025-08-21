import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { PersonsDBSchema } from "./repositories/persons.ts";

export type DBConfig = {
  postgresHost: string;
  postgresPort: number;
  postgresUser: string;
  postgresPassword: string;
  postgresDatabase: string;
};

export const createDB = (config: DBConfig) => {
  const dsn = `postgres://${config.postgresUser}:${config.postgresPassword}@${config.postgresHost}:${config.postgresPort}/${config.postgresDatabase}`;

  const pool = new Pool({ connectionString: dsn });
  const dialect = new PostgresDialect({ pool });
  const db = new Kysely<PersonsDBSchema>({ dialect });

  return db;
};
