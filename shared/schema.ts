import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const formSubmissions = pgTable("form_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role"),
  bottleneck: text("bottleneck"),
  revenue: text("revenue"),
  teamSize: text("team_size"),
  segment: text("segment"),
  urgency: text("urgency"),
  hasPartner: text("has_partner"),
  socialMedia: text("social_media"),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).omit({
  id: true,
  createdAt: true,
});

export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type FormSubmission = typeof formSubmissions.$inferSelect;

export const stepEvents = pgTable("step_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  step: integer("step").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStepEventSchema = createInsertSchema(stepEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertStepEvent = z.infer<typeof insertStepEventSchema>;
export type StepEvent = typeof stepEvents.$inferSelect;
