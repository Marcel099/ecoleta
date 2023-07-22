import knex from 'knex';
import path from 'path';
import 'dotenv/config';

const connection = knex({
    client: 'pg',
    connection: process.env.PG_DATABASE_URL,

    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
})

export default connection;
