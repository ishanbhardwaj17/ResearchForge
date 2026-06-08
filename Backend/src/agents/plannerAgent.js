import { llm } from "../config/gemini.js";
import { plannerSchema } from "./schemas/plannerSchema.js";

export const plannerAgent = async (state) => {
  const structuredLLM = llm.withStructuredOutput(plannerSchema);

  const result = await structuredLLM.invoke(`
You are an expert research planner.

Topic:
${state.query}

Create 5-7 research sections.

For each section generate:
- title
- exactly 3 focused search queries

The search queries should be highly specific and useful for web research.
`);

  console.log("Planner Output:");
  console.log(JSON.stringify(result, null, 2));

  return {
    ...state,
    researchPlan: result.sections,
  };
};
