import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp" }),
  image: text("image"),
  password: text("password"),
  role: text("role").default("user"),
  createdAt: integer("createdAt"),
  updatedAt: integer("updatedAt"),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  access_token: text("access_token"),
  expires_in: integer("expires_in"),
  id_token: text("id_token"),
  refresh_token: text("refresh_token"),
  refresh_token_expires_in: integer("refresh_token_expires_in"),
  scope: text("scope"),
  token_type: text("token_type"),
  createdAt: integer("createdAt"),
  updatedAt: integer("updatedAt"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionToken: text("sessionToken").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});
