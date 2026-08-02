import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  float,
} from "drizzle-orm/mysql-core";
/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Articles table for BBC Yangon News.
 * Stores all published and draft articles with metadata.
 */
export const articles = mysqlTable("articles", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["Myanmar", "World", "Politics", "Business", "Sport", "Culture"]).notNull(),
  coverImageUrl: text("coverImageUrl").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isBreaking: boolean("isBreaking").default(false).notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
export const visitorLogs = mysqlTable("visitor_logs", {
  id: int("id").autoincrement().primaryKey(),

  ipAddress: varchar("ip_address", { length: 45 }),

  latitude: decimal("latitude", {
    precision: 10,
    scale: 7,
  }).notNull(),

  longitude: decimal("longitude", {
    precision: 10,
    scale: 7,
  }).notNull(),

  accuracy: float("accuracy"),

  userAgent: text("user_agent"),
country: varchar("country", { length: 100 }),

city: varchar("city", { length: 100 }),

isp: varchar("isp", { length: 255 }),

browser: varchar("browser", { length: 100 }),

os: varchar("os", { length: 100 }),

device: varchar("device", { length: 100 }),

publicIp: varchar("public_ip", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type VisitorLog = typeof visitorLogs.$inferSelect;
export type InsertVisitorLog = typeof visitorLogs.$inferInsert;
export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),

  username: varchar("username", { length: 50 }).notNull().unique(),

  password: varchar("password", { length: 255 }).notNull(),

  name: varchar("name", { length: 100 }).notNull(),

  email: varchar("email", { length: 255 }).unique(),

  role: mysqlEnum("role", ["admin", "editor", "reporter"])
    .default("editor")
    .notNull(),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),

  lastLogin: timestamp("last_login"),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
