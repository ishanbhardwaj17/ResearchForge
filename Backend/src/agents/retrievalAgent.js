import { createEmbedding } from "../rag/embedDocuments.js";
import {
  searchVectorStore,
} from "../services/vectorStore.js";

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];

    magA += a[i] * a[i];

    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export const retrievalAgent = async (state) => {
  console.log("Retrieving relevant chunks...");

  const queryEmbedding = await createEmbedding(state.query, {
    preferredProvider: state.provider,
  });

  const topChunks = await searchVectorStore({
    namespaces: [state.reportId, "global"],
    embedding: queryEmbedding,
    limit: 15,
    similarityFn: cosineSimilarity,
  });

  console.log(`Retrieved Chunks: ${topChunks.length}`);

  return {
    ...state,

    retrievedChunks: topChunks,
  };
};
