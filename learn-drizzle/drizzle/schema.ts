import { mysqlTable, mysqlSchema, index, foreignKey, primaryKey, int, varchar, datetime, unique, tinyint, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"
import type { AnyMySqlColumn } from "drizzle-orm/mysql-core"

export const comments = mysqlTable("comments", {
	id: int().autoincrement().notNull(),
	commenter: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	comment: varchar({ length: 100 }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	index("commenter_idx").on(table.commenter),
	primaryKey({ columns: [table.id], name: "comments_id"}),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 20 }).notNull(),
	age: int({ unsigned: true }).notNull(),
	married: tinyint().notNull(),
	comment: text(),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("name_unique").on(table.name),
]);
