import { llm } from "../config/gemini.js";

export const plannerAgent = async (state) => {
  const prompt = `
You are a professional research planner.

Topic:
${state.query}

Create a research plan with 5-7 major sections.

IMPORTANT:
Return ONLY a JSON array.
Do not use markdown.
Do not use code fences.
Do not explain anything.

Example:
["Introduction","Applications","Benefits","Challenges","Future Trends"]
`;

  const response = await llm.invoke(prompt);

  console.log("Planner Raw Output:");
  console.log(response.content);

  let researchPlan = [];

  try {
    const cleaned = response.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    researchPlan = JSON.parse(cleaned);
  } catch (error) {
    console.error("Planner parsing failed:", error);

    researchPlan = [
      "Introduction",
      "Key Concepts",
      "Applications",
      "Benefits",
      "Challenges",
      "Future Directions",
    ];
  }

  return {
    ...state,
    researchPlan,
  };
};