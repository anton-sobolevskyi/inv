import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, DATABASE_HOST, DATABASE_PORT } = process.env;

const pool = mysql.createPool({
  host: DATABASE_HOST!,
  user: MYSQL_USER!,
  database: MYSQL_DATABASE!,
  port: Number(DATABASE_PORT!),
  password: MYSQL_PASSWORD!,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

export const db = drizzle({ client: pool });
