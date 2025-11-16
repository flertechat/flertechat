import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, subscriptions, conversations, messages, transactions, InsertSubscription, InsertConversation, InsertMessage, InsertTransaction } from "../drizzle/schema";
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

// Subscription helpers
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(subscriptions).values(data);
  return getUserSubscription(data.userId);
}

export async function updateSubscription(userId: number, data: Partial<InsertSubscription>) {
  const db = await getDb();
  if (!db) return null;

  await db.update(subscriptions).set(data).where(eq(subscriptions.userId, userId));
  return getUserSubscription(userId);
}

export async function deductCredit(userId: number) {
  const db = await getDb();
  if (!db) return false;

  const subscription = await getUserSubscription(userId);
  if (!subscription || subscription.creditsRemaining <= 0) {
    return false;
  }

  await db.update(subscriptions)
    .set({ creditsRemaining: subscription.creditsRemaining - 1 })
    .where(eq(subscriptions.userId, userId));

  // Log transaction
  await db.insert(transactions).values({
    userId,
    type: "credit_used",
    amount: 1,
    description: "Geração de mensagem",
  });

  return true;
}

// Conversation helpers
export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.createdAt));
}

export async function getConversationWithMessages(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const conversation = await db.select().from(conversations)
    .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)))
    .limit(1);

  if (conversation.length === 0) return null;

  const conversationMessages = await db.select().from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);

  return {
    ...conversation[0],
    messages: conversationMessages,
  };
}

export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(conversations).values(data);
  const insertId = result[0].insertId;
  
  const created = await db.select().from(conversations).where(eq(conversations.id, Number(insertId))).limit(1);
  return created.length > 0 ? created[0] : null;
}

// Message helpers
export async function addMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(messages).values(data);
  const insertId = result[0].insertId;
  
  const created = await db.select().from(messages).where(eq(messages.id, Number(insertId))).limit(1);
  return created.length > 0 ? created[0] : null;
}

export async function toggleMessageFavorite(messageId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const message = await db.select().from(messages)
    .where(and(eq(messages.id, messageId), eq(messages.userId, userId)))
    .limit(1);

  if (message.length === 0) return null;

  const newFavoriteStatus = !message[0].isFavorite;
  await db.update(messages)
    .set({ isFavorite: newFavoriteStatus })
    .where(eq(messages.id, messageId));

  const updated = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
  return updated.length > 0 ? updated[0] : null;
}

// Transaction helpers
export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(transactions).values(data);
  return true;
}
