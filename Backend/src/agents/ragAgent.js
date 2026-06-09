import { chunkDocuments }
from "../rag/chunkDocuments.js";

import { embedTexts }
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

  const chunkTexts = chunks.map((chunk) => chunk.text);
  const embeddings = await embedTexts(
    chunkTexts,
    { preferredProvider: state.provider }
  );

  const records = chunks.map((chunk, index) => ({
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
