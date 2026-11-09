import { datetime, int, mysqlTable } from 'drizzle-orm/mysql-core';

export const guarantees = mysqlTable('guarantees', {
  id: int('id').autoincrement().primaryKey(),
  start: datetime('start', { mode: 'string', fsp: 3 }),
  end: datetime('end', { mode: 'string', fsp: 3 }),
});
