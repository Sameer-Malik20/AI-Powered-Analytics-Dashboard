import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Metrics endpoints
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Revenue data for line chart
  app.get("/api/revenue-data", async (req, res) => {
    try {
      const revenueData = await storage.getRevenueData();
      res.json(revenueData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  // Users by region for bar chart
  app.get("/api/users-by-region", async (req, res) => {
    try {
      const usersData = await storage.getUsersByRegion();
      res.json(usersData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users by region data" });
    }
  });

  // Conversions by channel for pie chart
  app.get("/api/conversions-by-channel", async (req, res) => {
    try {
      const conversionsData = await storage.getConversionsByChannel();
      res.json(conversionsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversions by channel data" });
    }
  });

  // Campaigns endpoints
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      res.status(400).json({ message: "Invalid campaign data" });
    }
  });

  app.put("/api/campaigns/:id", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.partial().parse(req.body);
      const campaign = await storage.updateCampaign(req.params.id, validatedData);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ message: "Invalid campaign data" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCampaign(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Export endpoint (placeholder for CSV/PDF export)
  app.post("/api/export", async (req, res) => {
    try {
      const { type, data } = req.body;
      
      if (type === "csv") {
        // Generate CSV
        const campaigns = await storage.getCampaigns();
        const csvHeaders = "Campaign Name,Status,Budget,Impressions,Clicks,CTR\n";
        const csvData = campaigns.map(c => 
          `${c.name},${c.status},${c.budget},${c.impressions},${c.clicks},${c.ctr}%`
        ).join("\n");
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="campaigns.csv"');
        res.send(csvHeaders + csvData);
      } else {
        res.status(400).json({ message: "Unsupported export type" });
      }
    } catch (error) {
      res.status(500).json({ message: "Export failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
