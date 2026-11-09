import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema',
  out: './src/db/migrations',
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    database: process.env.MYSQL_DATABASE!,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    port: +process.env.DATABASE_PORT!,
  },
});
