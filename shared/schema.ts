import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  status: text("status").notNull(), // 'active', 'paused', 'draft'
  budget: integer("budget").notNull(),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  ctr: real("ctr").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const metrics = pgTable("metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  revenue: integer("revenue").notNull(),
  users: integer("users").notNull(),
  conversions: integer("conversions").notNull(),
  growth: real("growth").notNull(),
});

export const revenueData = pgTable("revenue_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  month: text("month").notNull(),
  revenue: integer("revenue").notNull(),
});

export const usersByRegion = pgTable("users_by_region", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  region: text("region").notNull(),
  users: integer("users").notNull(),
});

export const conversionsByChannel = pgTable("conversions_by_channel", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channel: text("channel").notNull(),
  conversions: integer("conversions").notNull(),
  percentage: real("percentage").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
});

export const insertMetricsSchema = createInsertSchema(metrics).omit({
  id: true,
});

export const insertRevenueDataSchema = createInsertSchema(revenueData).omit({
  id: true,
});

export const insertUsersByRegionSchema = createInsertSchema(usersByRegion).omit({
  id: true,
});

export const insertConversionsByChannelSchema = createInsertSchema(conversionsByChannel).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertMetrics = z.infer<typeof insertMetricsSchema>;
export type Metrics = typeof metrics.$inferSelect;

export type InsertRevenueData = z.infer<typeof insertRevenueDataSchema>;
export type RevenueData = typeof revenueData.$inferSelect;

export type InsertUsersByRegion = z.infer<typeof insertUsersByRegionSchema>;
export type UsersByRegion = typeof usersByRegion.$inferSelect;

export type InsertConversionsByChannel = z.infer<typeof insertConversionsByChannelSchema>;
export type ConversionsByChannel = typeof conversionsByChannel.$inferSelect;
