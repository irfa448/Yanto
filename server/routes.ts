import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse } from "./lib/ai";
import { insertMessageSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ 
        error: "Gagal ngambil pesan",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/messages", async (req, res) => {
    const parseResult = insertMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Format pesan ga valid" });
    }

    try {
      const message = await storage.addMessage(parseResult.data);

      if (message.role === "user") {
        try {
          const aiResponse = await getChatResponse(message.content);
          const assistantMessage = await storage.addMessage({
            content: aiResponse,
            role: "assistant"
          });
          res.json([message, assistantMessage]);
        } catch (error) {
          console.error("AI Response Error:", error);

          res.status(500).json({ 
            error: "Gagal dapet response dari AI", 
            details: error instanceof Error ? error.message : "Unknown error"
          });
        }
      } else {
        res.json([message]);
      }
    } catch (error) {
      res.status(500).json({ 
        error: "Gagal nambah pesan",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/messages/clear", async (_req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        error: "Gagal bersihin chat",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return createServer(app);
}