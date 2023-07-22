import path from 'path';
import 'dotenv/config';

module.exports = {
    client: 'pg',
    connection: process.env.PG_DATABASE_URL,

    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },

    useNullAsDefault: true,
}