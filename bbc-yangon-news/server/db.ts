import axios from "axios";
import { UAParser } from "ua-parser-js";
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  articles,
  InsertArticle,
  visitorLogs,
  InsertVisitorLog,
  adminUsers,
  AdminUser,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Article queries
export async function listArticles(category?: string) {
  const db = await getDb();
  if (!db) return [];

  if (category) {
    return db
      .select()
      .from(articles)
      .where(eq(articles.category, category as any))
.orderBy(desc(visitorLogs.id)) 
 }
  return db.select().from(articles).orderBy(articles.publishedAt);
}

export async function getArticleById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedArticle() {
  const db = await getDb();

  if (!db) {
    return null;
  }

  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.isFeatured, true))
    .orderBy(articles.publishedAt)
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getBreakingArticle() {
  const db = await getDb();

  if (!db) {
    return null;
  }

  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.isBreaking, true))
    .orderBy(articles.publishedAt)
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
export async function createArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(articles).values(data);
  return getArticleById(data.id);
}

export async function updateArticle(id: string, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(articles).set({ ...data, updatedAt: new Date() }).where(eq(articles.id, id));
  return getArticleById(id);
}

export async function deleteArticle(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(articles).where(eq(articles.id, id));
}

export async function getArticleStats() {
  const db = await getDb();
  if (!db) return { total: 0, byCategory: {} };

  const allArticles = await db.select().from(articles);
  const byCategory: Record<string, number> = {};

  for (const article of allArticles) {
    byCategory[article.category] = (byCategory[article.category] || 0) + 1;
  }

  return { total: allArticles.length, byCategory };
}
export async function saveVisitorLocation(data: InsertVisitorLog) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database not available");
  }
let country = null;
let city = null;
let isp = null;
let browser = null;
let os = null;
let device = null;
try {
  const ip = (data.ipAddress || "").split(",")[0].trim();
const res = await axios.get(`https://ipwho.is/${ip}`);

if (res.data.success) {
  country = res.data.country;
  city = res.data.city;
  isp = res.data.connection?.isp ?? null;
}
const parser = new UAParser(data.userAgent || "");

browser = parser.getBrowser().name || null;
os = parser.getOS().name || null;
device = parser.getDevice().type || "Desktop";
if (
  ip &&
  !ip.startsWith("192.168.") &&
  !ip.startsWith("10.") &&
  !ip.startsWith("172.") &&
  ip !== "::1" &&
  ip !== "127.0.0.1"
) {
  // နောက် Step မှာ API ခေါ်မယ်
}
} catch (err) {
  console.error(err);
}
console.log("saveVisitorLocation data =", data);
await db.insert(visitorLogs).values({
  ...data,
  country,
  city,
  isp,
  browser,
  os,
  device,
  publicIp: data.ipAddress,
});
  return {
    success: true,
  };
}
export async function getVisitorStats() {
  const db = await getDb();

  if (!db) {
    return {
      total: 0,
      today: 0,
      week: 0,
      month: 0,
    };
  }

  const visitors = await db.select().from(visitorLogs);

  const now = new Date();

  const today = visitors.filter((v) => {
    const d = new Date(v.createdAt!);
    return d.toDateString() === now.toDateString();
  }).length;

  const week = visitors.filter((v) => {
    const d = new Date(v.createdAt!);
    return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  const month = visitors.filter((v) => {
    const d = new Date(v.createdAt!);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  return {
    total: visitors.length,
    today,
    week,
    month,
  };
}

export async function findAdminByUsername(username: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
export async function updateAdminLastLogin(id: number) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(adminUsers)
    .set({
      lastLogin: new Date(),
    })
    .where(eq(adminUsers.id, id));
}
export async function saveAdminTwoFactorSecret(
  id: number,
  secret: string
) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(adminUsers)
    .set({
      twoFactorSecret: secret,
    })
    .where(eq(adminUsers.id, id));
}

export async function enableAdminTwoFactor(id: number) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(adminUsers)
    .set({
      twoFactorEnabled: true,
    })
    .where(eq(adminUsers.id, id));
}

export async function disableAdminTwoFactor(id: number) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(adminUsers)
    .set({
      twoFactorEnabled: false,
      twoFactorSecret: null,
    })
    .where(eq(adminUsers.id, id));
}
export async function findAdminById(id: number) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function listVisitorLocations() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select()
    .from(visitorLogs)
    .orderBy(desc(visitorLogs.id));
}
