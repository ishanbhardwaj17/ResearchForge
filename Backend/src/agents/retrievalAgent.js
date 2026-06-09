import { createEmbedding } from "../rag/embedDocuments.js";

import { VectorDocument } from "../models/VectorDocument.js";

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

  const queryEmbedding = await createEmbedding(state.query);

  const documents = await VectorDocument.find();

  const scoredDocs = documents.map((doc) => ({
    doc,

    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  scoredDocs.sort((a, b) => b.score - a.score);

  const topChunks = scoredDocs.slice(0, 10).map((item) => ({
    text: item.doc.text,

    metadata: item.doc.metadata,

    score: item.score,
  }));

  console.log(`Retrieved Chunks: ${topChunks.length}`);

  return {
    ...state,

    retrievedChunks: topChunks,
  };
};
