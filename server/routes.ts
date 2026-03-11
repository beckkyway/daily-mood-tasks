import type { Express } from "express";
import { createServer, type Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.post(api.challenges.generate.path, async (req, res) => {
    try {
      const { energyLevel } = api.challenges.generate.input.parse(req.body);

      const prompt = `Generate 3 fun micro-tasks tailored to a '${energyLevel}' energy level / mood.
Return ONLY valid JSON in this exact format, with no markdown formatting or other text:
[{"icon": "🏃", "title": "Task name", "description": "Short description"}]`;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GOOGLE_API_KEY || ""}`,
            "HTTP-Referer": "https://replit.com",
            "X-Title": "Daily Challenge Generator",
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash", // Free model via OpenRouter
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "[]";

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
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Error generating challenges:", err);
      res.status(500).json({
        message: err instanceof Error ? err.message : "Internal Server Error",
      });
    }
  });

  return httpServer;
}
