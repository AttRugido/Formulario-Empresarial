import { 
  type User, 
  type InsertUser, 
  type FormSubmission, 
  type InsertFormSubmission,
  type StepEvent,
  type InsertStepEvent,
  type PartialLead,
  type InsertPartialLead,
  users,
  formSubmissions,
  stepEvents,
  partialLeads
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  getFormSubmissions(): Promise<FormSubmission[]>;
  getFormSubmission(id: string): Promise<FormSubmission | undefined>;
  
  createStepEvent(event: InsertStepEvent): Promise<StepEvent>;
  getFunnelAnalytics(): Promise<{ step: number; count: number }[]>;
  
  upsertPartialLead(lead: InsertPartialLead): Promise<PartialLead>;
  getPartialLeads(): Promise<PartialLead[]>;
  getPartialLeadByDraftId(draftId: string): Promise<PartialLead | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const [result] = await db.insert(formSubmissions).values(submission).returning();
    return result;
  }

  async getFormSubmissions(): Promise<FormSubmission[]> {
    return await db.select().from(formSubmissions).orderBy(desc(formSubmissions.createdAt));
  }

  async getFormSubmission(id: string): Promise<FormSubmission | undefined> {
    const [result] = await db.select().from(formSubmissions).where(eq(formSubmissions.id, id));
    return result;
  }

  async createStepEvent(event: InsertStepEvent): Promise<StepEvent> {
    const [result] = await db.insert(stepEvents).values(event).returning();
    return result;
  }

  async getFunnelAnalytics(): Promise<{ step: number; count: number }[]> {
    const result = await db
      .select({
        step: stepEvents.step,
        count: sql<number>`count(distinct ${stepEvents.sessionId})`.as('count')
      })
      .from(stepEvents)
      .groupBy(stepEvents.step)
      .orderBy(stepEvents.step);
    
    return result.map((r: { step: number; count: number }) => ({ step: r.step, count: Number(r.count) }));
  }

  async upsertPartialLead(lead: InsertPartialLead): Promise<PartialLead> {
    const [result] = await db
      .insert(partialLeads)
      .values({
        ...lead,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: partialLeads.draftId,
        set: {
          email: lead.email,
          phone: lead.phone,
          currentStep: lead.currentStep,
          answers: lead.answers,
          status: lead.status,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async getPartialLeads(): Promise<PartialLead[]> {
    return await db.select().from(partialLeads).orderBy(desc(partialLeads.updatedAt));
  }

  async getPartialLeadByDraftId(draftId: string): Promise<PartialLead | undefined> {
    const [result] = await db.select().from(partialLeads).where(eq(partialLeads.draftId, draftId));
    return result;
  }
}

export const storage = new DatabaseStorage();
