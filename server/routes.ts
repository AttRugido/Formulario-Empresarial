import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFormSubmissionSchema, insertStepEventSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/submissions", async (req, res) => {
    try {
      const parsed = insertFormSubmissionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const submission = await storage.createFormSubmission(parsed.data);
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to create submission" });
    }
  });

  app.get("/api/submissions", async (req, res) => {
    try {
      const submissions = await storage.getFormSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/submissions/export", async (req, res) => {
    try {
      const submissions = await storage.getFormSubmissions();
      
      const headers = ["ID", "Nome", "Email", "Telefone", "Cargo", "Gargalo", "Faturamento", "Tamanho Equipe", "Segmento", "Urgência", "Tem Sócio", "Redes Sociais", "Data"];
      const csvRows = [headers.join(",")];
      
      for (const sub of submissions) {
        const row = [
          sub.id,
          `"${(sub.name || "").replace(/"/g, '""')}"`,
          `"${(sub.email || "").replace(/"/g, '""')}"`,
          `"${(sub.phone || "").replace(/"/g, '""')}"`,
          `"${(sub.role || "").replace(/"/g, '""')}"`,
          `"${(sub.bottleneck || "").replace(/"/g, '""')}"`,
          `"${(sub.revenue || "").replace(/"/g, '""')}"`,
          `"${(sub.teamSize || "").replace(/"/g, '""')}"`,
          `"${(sub.segment || "").replace(/"/g, '""')}"`,
          `"${(sub.urgency || "").replace(/"/g, '""')}"`,
          `"${(sub.hasPartner || "").replace(/"/g, '""')}"`,
          `"${(sub.socialMedia || "").replace(/"/g, '""')}"`,
          sub.createdAt ? new Date(sub.createdAt).toISOString() : ""
        ];
        csvRows.push(row.join(","));
      }
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=submissions.csv");
      res.send(csvRows.join("\n"));
    } catch (error) {
      res.status(500).json({ error: "Failed to export submissions" });
    }
  });

  app.get("/api/submissions/:id", async (req, res) => {
    try {
      const submission = await storage.getFormSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  app.post("/api/step-events", async (req, res) => {
    try {
      const parsed = insertStepEventSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const event = await storage.createStepEvent(parsed.data);
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create step event" });
    }
  });

  app.get("/api/analytics/funnel", async (req, res) => {
    try {
      const funnel = await storage.getFunnelAnalytics();
      res.json(funnel);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch funnel analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
