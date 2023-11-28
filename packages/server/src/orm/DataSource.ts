import { join } from 'path';

import { DataSource } from 'typeorm';

import { SnakeCaseNamingStrategy } from 'src/orm/namingStrategy';

const entitiesDir = join(__dirname, 'entities/*.{ts,js}');
console.log('entities dir is', entitiesDir);

export const AppDataSource = new DataSource({
    type: 'postgres',
    name: 'default',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    entities: [entitiesDir],
    migrations: ['src/orm/migrations/**/*.ts'],
    subscribers: ['src/orm/subscriber/**/*.ts'],
    namingStrategy: new SnakeCaseNamingStrategy(),
    ssl: {
        rejectUnauthorized: false,
    },
});

export function dbCreateConnection() {
    return AppDataSource.initialize()
        .then(() => {
            console.log('Data Source has been initialized!');
        })
        .catch((err) => {
            console.error('Error during Data Source initialization', err);
        });
}
