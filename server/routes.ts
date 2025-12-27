import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFormSubmissionSchema, insertStepEventSchema } from "@shared/schema";

const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/submissions", async (req, res) => {
    try {
      const parsed = insertFormSubmissionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      
      if (GOOGLE_SHEETS_WEBHOOK_URL) {
        const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parsed.data),
        });
        
        if (!response.ok) {
          throw new Error('Failed to send to Google Sheets');
        }
        
        const result = await response.json();
        res.json({ success: true, message: 'Dados salvos na planilha' });
      } else {
        const submission = await storage.createFormSubmission(parsed.data);
        res.json(submission);
      }
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(500).json({ error: "Failed to create submission" });
    }
  });

  app.get("/api/submissions", async (req, res) => {
    try {
      if (GOOGLE_SHEETS_WEBHOOK_URL) {
        const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch from Google Sheets');
        }
        
        const data = await response.json();
        res.json(data);
      } else {
        const submissions = await storage.getFormSubmissions();
        res.json(submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/submissions/export", async (req, res) => {
    try {
      let submissions: any[] = [];
      
      if (GOOGLE_SHEETS_WEBHOOK_URL) {
        const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'GET',
        });
        
        if (response.ok) {
          submissions = await response.json();
        }
      } else {
        submissions = await storage.getFormSubmissions();
      }
      
      const headers = ["ID", "Nome", "Email", "Telefone", "Cargo", "Gargalo", "Faturamento", "Tamanho Equipe", "Segmento", "Urgência", "Tem Sócio", "Redes Sociais", "Data"];
      const csvRows = [headers.join(",")];
      
      for (const sub of submissions) {
        const row = [
          sub.id || "",
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
          sub.createdAt || ""
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
      if (GOOGLE_SHEETS_WEBHOOK_URL) {
        const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'GET',
        });
        
        if (response.ok) {
          const data = await response.json();
          const submission = data.find((s: any) => s.id === req.params.id);
          if (submission) {
            return res.json(submission);
          }
        }
        return res.status(404).json({ error: "Submission not found" });
      } else {
        const submission = await storage.getFormSubmission(req.params.id);
        if (!submission) {
          return res.status(404).json({ error: "Submission not found" });
        }
        res.json(submission);
      }
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
