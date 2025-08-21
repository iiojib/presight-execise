import type { DBConfig } from "./db.ts";
import type { ServerConfig } from "./server.ts";

export type Config = {
  db: DBConfig;
  server: ServerConfig;
};

export const createConfig = (): Config => ({
  db: {
    postgresHost: String(process.env["POSTGRES_HOST"]),
    postgresPort: Number(process.env["POSTGRES_PORT"]),
    postgresUser: String(process.env["POSTGRES_USER"]),
    postgresPassword: String(process.env["POSTGRES_PASSWORD"]),
    postgresDatabase: String(process.env["POSTGRES_DB"]),
  },

  server: {
    port: Number(process.env["API_PORT"]),
  },
});
