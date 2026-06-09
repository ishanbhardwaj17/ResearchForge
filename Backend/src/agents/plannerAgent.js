import { llm } from "../config/gemini.js";
import { plannerSchema } from "./schemas/plannerSchema.js";

export const plannerAgent = async (state) => {
  const structuredLLM = llm.withStructuredOutput(plannerSchema);

  const result = await structuredLLM.invoke(`
You are a senior research planner.

Topic:
${state.query}

Your responsibilities:

1. Determine the report type.

2. Create 5-7 major research sections.

For each section generate:

- title
- objective
- importance (1-5)
- 3-5 research questions
- 3-8 keywords
- 3-5 search queries
- 1-3 expected source types

Allowed expected source types:

research_papers
industry_reports
government_reports
news_articles
case_studies

Guidelines:

- Higher importance means the topic deserves deeper research.
- Research questions should drive investigation.
- Search queries should be specific and optimized for web search.
- Keywords should support future retrieval and indexing.
- Avoid overlapping sections.
`);

  if (!result.sections || result.sections.length < 5) {
    throw new Error("Planner generated insufficient sections");
  }

  console.log("\n===== PLANNER OUTPUT =====");
  console.log(JSON.stringify(result, null, 2));
  console.log("==========================\n");

  return {
    ...state,

    reportType: result.reportType,

    researchPlan: result.sections,
  };
};
