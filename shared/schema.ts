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
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  referrer: text("referrer"),
  firstPage: text("first_page"),
  currentPage: text("current_page"),
  device: text("device"),
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

export const partialLeads = pgTable("partial_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  draftId: text("draft_id").notNull().unique(),
  email: text("email"),
  phone: text("phone"),
  currentStep: integer("current_step").notNull().default(1),
  answers: text("answers").notNull().default("{}"),
  status: text("status").notNull().default("draft"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPartialLeadSchema = createInsertSchema(partialLeads).omit({
  id: true,
});

export type InsertPartialLead = z.infer<typeof insertPartialLeadSchema>;
export type PartialLead = typeof partialLeads.$inferSelect;
