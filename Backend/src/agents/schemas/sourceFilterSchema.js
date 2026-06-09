import { z } from "zod";

export const sourceFilterSchema = z.object({
  authority: z.number().min(1).max(10),

  relevance: z.number().min(1).max(10),

  freshness: z.number().min(1).max(10),

  finalScore: z.number().min(1).max(10),

  reason: z.string(),
});