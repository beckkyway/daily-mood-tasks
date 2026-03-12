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

      const prompt = `Сгенерируй 3 весёлых микротаска, подходящих для уровня энергии '${energyLevel}' (low=низкий, medium=средний, high=высокий).
Верни ТОЛЬКО валидный JSON в таком формате, без markdown и других текстов:
[{"icon": "🏃", "title": "Название задачи", "description": "Короткое описание"}]`;

      const apiKey = process.env.OPENROUTER_API_KEY || "";
      if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY is not set");
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://replit.com",
          "X-Title": "Daily Mood Tasks",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",  // можно заменить на любую модель
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
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
          throw new Error("Failed to parse JSON from OpenRouter response");
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