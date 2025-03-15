import { join } from "path";

import { DataSource } from "typeorm";

import { SnakeCaseNamingStrategy } from "orm/namingStrategy";

const entitiesDir = join(__dirname, "entities/*.{ts,js}");

export const AppDataSource = new DataSource({
  type: "postgres",
  name: "default",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [entitiesDir],
  migrations: ["src/orm/migrations/**/*.ts"],
  subscribers: ["src/orm/subscriber/**/*.ts"],
  namingStrategy: new SnakeCaseNamingStrategy(),
  ssl: {
    rejectUnauthorized: false,
  },
});

export function dbCreateConnection() {
  return AppDataSource.initialize().catch((err: unknown) => {
    console.error("Error during Data Source initialization", err);
  });
}
