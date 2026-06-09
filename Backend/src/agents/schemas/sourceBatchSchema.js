import { z } from "zod";

export const sourceBatchSchema = z.object({
  evaluations: z.array(
    z.object({
      sourceIndex: z.number(),

      authority: z.number().min(1).max(10),

      relevance: z.number().min(1).max(10),

      freshness: z.number().min(1).max(10),

      finalScore: z.number().min(1).max(10),

      reason: z.string(),
    })
  ),
});