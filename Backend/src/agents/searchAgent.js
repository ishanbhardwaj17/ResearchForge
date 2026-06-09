import { tavilySearch } from "../tools/tavilyTool.js";

export const searchAgent = async (state) => {
  const searchResults = [];
  const searchEnabled = state.searchEnabled !== false;

  const uniqueQueries = new Set();

  for (const section of state.researchPlan) {
    const sectionResults = [];

    const maxResults = 3;

    for (const query of section.searchQueries) {
      if (!searchEnabled) {
        break;
      }

      if (uniqueQueries.has(query))
        continue;

      uniqueQueries.add(query);

      console.log(
        `Searching: ${query}`
      );

      const results =
        await tavilySearch(
          query,
          maxResults
        );

      sectionResults.push({
        query,
        results,
      });
    }

    searchResults.push({
      title: section.title,

      objective:
        section.objective,

      importance:
        section.importance,

      researchQuestions:
        section.researchQuestions,

      keywords:
        section.keywords,

      expectedSources:
        section.expectedSources,

      searches:
        sectionResults,
    });
  }

  return {
    ...state,

    searchResults,
  };
};
