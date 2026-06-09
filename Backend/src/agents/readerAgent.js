import { readUrl } from "../tools/readerTool.js";

const MAX_DOCUMENTS = 4;
const READ_CONCURRENCY = 4;

export const readerAgent = async (state) => {
  const scrapedDocuments = [...(state.sourceTexts || [])];
  const seenUrls = new Set(scrapedDocuments.map((doc) => doc.url).filter(Boolean));
  const readQueue = [];

  for (const url of state.sourceUrls || []) {
    if (seenUrls.has(url)) {
      continue;
    }

    seenUrls.add(url);
    readQueue.push({
      sectionTitle: "User Provided Sources",
      sourceTitle: url,
      url,
    });
  }

  outerLoop: for (const section of state.searchResults) {
    for (const search of section.searches) {
      if (readQueue.length >= MAX_DOCUMENTS) {
        break outerLoop;
      }

      const bestSource = search.results?.[0];

      if (!bestSource || seenUrls.has(bestSource.url)) {
        continue;
      }

      seenUrls.add(bestSource.url);
      readQueue.push({
        sectionTitle: section.title,
        sourceTitle: bestSource.title,
        url: bestSource.url,
      });
    }
  }

  for (let index = 0; index < readQueue.length; index += READ_CONCURRENCY) {
    const batch = readQueue.slice(index, index + READ_CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (item) => {
        console.log(`Reading: ${item.sourceTitle}`);
        const content = await readUrl(item.url);
        return { ...item, content };
      }),
    );

    for (const result of results) {
      if (!result.content || result.content.length < 500) {
        console.log(`Skipping weak content: ${result.sourceTitle}`);
        continue;
      }

      scrapedDocuments.push(result);
    }
  }

  console.log(`Documents scraped: ${scrapedDocuments.length}`);

  return {
    ...state,
    scrapedDocuments,
  };
};
