import tavilyTool from "../tools/tavilyTool.js";

export const searchAgent = async (state) => {
  const allResults = [];

  for (const section of state.researchPlan) {
    const sectionResults = [];

    for (const query of section.searchQueries) {
      try {
        const results = await tavilyTool.invoke(query);

        sectionResults.push({
          query,
          results,
        });
      } catch (error) {
        console.error(
          `Search failed for: ${query}`,
          error.message
        );
      }
    }

    allResults.push({
      title: section.title,
      objective: section.objective,
      researchQuestions: section.researchQuestions,
      keywords: section.keywords,
      searches: sectionResults,
    });
  }

  return {
    ...state,
    searchResults: allResults,
  };
};