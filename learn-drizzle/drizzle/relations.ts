import { relations } from "drizzle-orm/relations";
import { users, comments } from "./schema.ts";

export const commentsRelations = relations(comments, ({one}) => ({
	user: one(users, {
		fields: [comments.commenter],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	comments: many(comments),
}));