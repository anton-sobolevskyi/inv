import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, DATABASE_HOST, DATABASE_PORT } = process.env;

export default async function connect() {
  const connection = await mysql.createConnection({
    host: DATABASE_HOST!,
    user: MYSQL_USER!,
    database: MYSQL_DATABASE!,
    port: +DATABASE_PORT!,
    password: MYSQL_PASSWORD!,
  });

  const db = drizzle({ client: connection });

  return db;
}
