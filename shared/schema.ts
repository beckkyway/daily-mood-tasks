import { z } from "zod";

export const energyLevelSchema = z.enum(["low", "medium", "high"]);
export type EnergyLevel = z.infer<typeof energyLevelSchema>;

export const taskSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean().optional().default(false),
});
export type Task = z.infer<typeof taskSchema>;

export const generateChallengeRequestSchema = z.object({
  energyLevel: energyLevelSchema,
});
export type GenerateChallengeRequest = z.infer<typeof generateChallengeRequestSchema>;

export const generateChallengeResponseSchema = z.object({
  tasks: z.array(taskSchema),
});
export type GenerateChallengeResponse = z.infer<typeof generateChallengeResponseSchema>;
