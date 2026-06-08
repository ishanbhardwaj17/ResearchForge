import { llm } from "../config/gemini.js";
import { plannerSchema } from "./schemas/plannerSchema.js";

export const plannerAgent = async (state) => {
  const structuredLLM = llm.withStructuredOutput(plannerSchema);

  const result = await structuredLLM.invoke(`
You are a senior research planner.

Topic:
${state.query}

Your task:

1. Determine the report type.

2. Create 5-7 major research sections.

For each section generate:

- title
- objective
- 3-5 research questions
- 3-8 important keywords
- 3-5 highly specific search queries

The research questions should guide the investigation.

The search queries should be optimized for finding
high quality information on the web.

The keywords should help future retrieval and indexing.
`);

  if (result.sections.length < 3) {
    throw new Error("Planner generated too few sections");
  }

  console.log("Planner Output:");
  console.log(JSON.stringify(result, null, 2));

  return {
    ...state,
    researchPlan: result.sections,
  };
};
