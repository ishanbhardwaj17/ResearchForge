import { llm } from "../config/gemini.js";
import { sourceBatchSchema } from "./schemas/sourceBatchSchema.js";

const BATCH_SIZE = 10;

export const sourceFilterAgent = async (state) => {
  const structuredLLM =
    llm.withStructuredOutput(
      sourceBatchSchema
    );

  const filteredSources = [];

  for (const section of state.searchResults) {
    console.log(
      `Filtering section: ${section.title}`
    );

    let allSources = [];

    for (const search of section.searches) {
      allSources.push(...search.results);
    }

    // =========================
    // URL Deduplication
    // =========================

    const seenUrls = new Set();

    const uniqueSources = [];

    for (const source of allSources) {
      if (
        !source.url ||
        seenUrls.has(source.url)
      ) {
        continue;
      }

      seenUrls.add(source.url);

      uniqueSources.push(source);
    }

    console.log(
      `Unique sources: ${uniqueSources.length}`
    );

    const approvedResults = [];

    // =========================
    // Batch Processing
    // =========================

    for (
      let i = 0;
      i < uniqueSources.length;
      i += BATCH_SIZE
    ) {
      const batch =
        uniqueSources.slice(
          i,
          i + BATCH_SIZE
        );

      try {
        const evaluation =
          await structuredLLM.invoke(`
You are a research source evaluator.

Evaluate every source.

For each source provide:

- authority (1-10)
- relevance (1-10)
- freshness (1-10)
- finalScore (1-10)
- short reason

Sources:

${JSON.stringify(
  batch.map((source, index) => ({
    sourceIndex: index,

    title:
      source.title || "",

    url:
      source.url || "",

    content:
      source.content?.slice(
        0,
        1000
      ) || "",
  })),
  null,
  2
)}
`);

        evaluation.evaluations.forEach(
          (item) => {
            if (
              item.finalScore >= 7
            ) {
              approvedResults.push({
                ...batch[
                  item.sourceIndex
                ],

                evaluation: item,
              });
            }
          }
        );
      } catch (error) {
        console.error(
          "Batch Filter Error:",
          error.message
        );
      }
    }

    filteredSources.push({
      title: section.title,

      objective:
        section.objective,

      approvedResults,
    });
  }

  console.log(
    `Filtered sections: ${filteredSources.length}`
  );

  return {
    ...state,

    filteredSources,
  };
};