import { z } from "zod";

export const plannerSchema = z.object({
  sections: z.array(
    z.object({
      title: z.string(),

      objective: z.string(),

      searchQueries: z.array(z.string()).min(3).max(3),
    })
  ),
});