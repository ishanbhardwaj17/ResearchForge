import { chunkDocuments }
from "../rag/chunkDocuments.js";

import { embedTexts }
from "../rag/embedDocuments.js";

import {
  addDocumentsToVectorStore,
  getVectorStoreStats,
} from "../services/vectorStore.js";

function dedupeDocuments(documents) {
  const unique = new Map();

  for (const document of documents) {
    const content = document?.content?.trim();

    if (!content) {
      continue;
    }

    const key = document.url?.trim() || content;

    if (!unique.has(key)) {
      unique.set(key, {
        ...document,
        content,
      });
    }
  }

  return [...unique.values()];
}

export const ragAgent =
async (state) => {
  const uniqueDocuments =
    dedupeDocuments(
      state.scrapedDocuments
    );


  console.log(
    "Creating chunks..."
  );

  const chunks =
    await chunkDocuments(
      uniqueDocuments
    );

  console.log(
    `Chunks created: ${chunks.length}`
  );

  const chunkTexts = chunks.map((chunk) => chunk.text);
  const embeddings = await embedTexts(
    chunkTexts,
    { preferredProvider: state.provider }
  );

  const records = chunks.map((chunk, index) => ({
    reportId: state.reportId,
    namespace: state.reportId,
    text:
      chunk.text,
    embedding:
      embeddings[index],
    metadata:
      {
        ...chunk.metadata,
        reportId: state.reportId,
      },
  }));

  const storedCount =
    await addDocumentsToVectorStore(
      records
    );

  console.log(
    `Stored chunks: ${storedCount}`
  );

  return {
    ...state,
    vectorStoreStats:
      getVectorStoreStats(),
  };
};
