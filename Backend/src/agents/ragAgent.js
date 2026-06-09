import { chunkDocuments }
from "../rag/chunkDocuments.js";

import { createEmbedding }
from "../rag/embedDocuments.js";

import {
  addDocumentsToVectorStore,
  getVectorStoreStats,
} from "../services/vectorStore.js";

export const ragAgent =
async (state) => {

  console.log(
    "Creating chunks..."
  );

  const chunks =
    await chunkDocuments(
      state.scrapedDocuments
    );

  console.log(
    `Chunks created: ${chunks.length}`
  );

  const records = [];

  for (const chunk of chunks) {
    try {
      const embedding =
        await createEmbedding(
          chunk.text,
          { preferredProvider: state.provider }
        );

      records.push({
        namespace: state.reportId,
        text:
          chunk.text,
        embedding,
        metadata:
          {
            ...chunk.metadata,
            reportId: state.reportId,
          },
      });
    } catch (error) {
      console.error(
        error.message
      );
    }
  }

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
