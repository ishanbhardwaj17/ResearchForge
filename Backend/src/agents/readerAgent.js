import { readUrl } from "../tools/readerTool.js";

const MAX_DOCUMENTS = 8;

export const readerAgent = async (state) => {
  const scrapedDocuments = [];

  let documentsRead = 0;

  outerLoop: for (const section of state.searchResults) {
    for (const search of section.searches) {
      if (documentsRead >= MAX_DOCUMENTS) {
        break outerLoop;
      }

      const bestSource = search.results?.[0];

      if (!bestSource) continue;

      console.log(`Reading: ${bestSource.title}`);

      const content = await readUrl(bestSource.url);

      if (!content || content.length < 500) {
        console.log(`Skipping weak content: ${bestSource.title}`);
        continue;
      }

      scrapedDocuments.push({
        sectionTitle: section.title,

        sourceTitle: bestSource.title,

        url: bestSource.url,

        content,
      });

      documentsRead++;
    }
  }

  console.log(`Documents scraped: ${scrapedDocuments.length}`);

  return {
    ...state,
    scrapedDocuments,
  };
};
