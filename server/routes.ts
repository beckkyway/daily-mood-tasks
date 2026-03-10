import type { Express } from "express";
import { createServer, type Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.challenges.generate.path, async (req, res) => {
    try {
      const { energyLevel } = api.challenges.generate.input.parse(req.body);
      
      const prompt = `Generate 3 fun micro-tasks tailored to a '${energyLevel}' energy level / mood.
Return ONLY valid JSON in this exact format, with no markdown formatting or other text:
[{"icon": "🏃", "title": "Task name", "description": "Short description"}]`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", // As requested by user
          max_tokens: 1024,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Anthropic API Error:", errorText);
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || "[]";
      
      let tasks;
      try {
        tasks = JSON.parse(content);
      } catch (err) {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          tasks = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse JSON from Anthropic response");
        }
      }

      res.status(200).json({ tasks });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Error generating challenges:", err);
      res.status(500).json({ message: err instanceof Error ? err.message : "Internal Server Error" });
    }
  });

  return httpServer;
}
