import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  id: uuid("id").notNull().defaultRandom(),
  walletAddress: varchar("walletAddress", { length: 255 })
    .notNull()
    .primaryKey(),
});

export const ChallengeStore = pgTable("challengeStore", {
  id: uuid("id").notNull().defaultRandom(),
  walletAddress: varchar("walletAddress", { length: 255 })
    .notNull()
    .primaryKey(),
  issuedAt: timestamp("issuedAt").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  nonce: varchar("nonce", { length: 255 }).notNull(),
});
