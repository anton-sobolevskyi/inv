import { drizzle } from 'drizzle-orm/mysql2';

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, DATABASE_HOST, DATABASE_PORT } = process.env;

const databaseUrl = `mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${MYSQL_DATABASE}`;

const db = drizzle(databaseUrl);

console.log('Database Connected', db);
