import { tavilySearch } from "../tools/tavilyTool.js";

const MAX_SEARCH_QUERIES = 8;
const SEARCH_CONCURRENCY = 4;

export const searchAgent = async (state) => {
  const searchResults = [];
  const searchEnabled = state.searchEnabled !== false;
  const maxResults = 2;

  if (!searchEnabled) {
    return {
      ...state,
      searchResults: state.researchPlan.map((section) => ({
        title: section.title,
        objective: section.objective,
        importance: section.importance,
        researchQuestions: section.researchQuestions,
        keywords: section.keywords,
        expectedSources: section.expectedSources,
        searches: [],
      })),
    };
  }

  const sectionMap = new Map();
  const workItems = [];
  const uniqueQueries = new Set();

  for (const section of state.researchPlan) {
    sectionMap.set(section.title, {
      title: section.title,
      objective: section.objective,
      importance: section.importance,
      researchQuestions: section.researchQuestions,
      keywords: section.keywords,
      expectedSources: section.expectedSources,
      searches: [],
    });

    for (const query of section.searchQueries.slice(0, 2)) {
      if (workItems.length >= MAX_SEARCH_QUERIES) {
        break;
      }

      if (uniqueQueries.has(query)) {
        continue;
      }

      uniqueQueries.add(query);
      workItems.push({ sectionTitle: section.title, query });
    }
  }

  for (let index = 0; index < workItems.length; index += SEARCH_CONCURRENCY) {
    const batch = workItems.slice(index, index + SEARCH_CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (item) => {
        console.log(`Searching: ${item.query}`);
        const entries = await tavilySearch(item.query, maxResults);
        return { ...item, results: entries };
      }),
    );

    for (const result of results) {
      sectionMap.get(result.sectionTitle)?.searches.push({
        query: result.query,
        results: result.results,
      });
    }
  }

  for (const section of state.researchPlan) {
    searchResults.push(sectionMap.get(section.title));
  }

  return {
    ...state,

    searchResults,
  };
};
