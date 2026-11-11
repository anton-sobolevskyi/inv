import { datetime, int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'users',
  {
    id: int('id').autoincrement().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    displayName: varchar('display_name', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: datetime('created_at', { mode: 'string', fsp: 3 }).notNull(),
  },
  (table) => [uniqueIndex('users_email_uq').on(table.email)]
);
