import { z } from "zod";

export const plannerSchema = z.object({
  reportType: z.enum([
    "overview",
    "comparative_analysis",
    "technical_research",
    "market_research",
    "policy_analysis",
    "trend_analysis",
  ]),

  sections: z.array(
    z.object({
      title: z.string(),

      objective: z.string(),

      researchQuestions: z.array(z.string()).min(3).max(5),

      keywords: z.array(z.string()).min(3).max(8),

      searchQueries: z.array(z.string()).min(3).max(5),
    }),
  ),
});
