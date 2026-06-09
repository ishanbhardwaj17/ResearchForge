import { chunkDocuments }
from "../rag/chunkDocuments.js";

import { createEmbedding }
from "../rag/embedDocuments.js";

import { VectorDocument }
from "../models/VectorDocument.js";

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

  let storedCount = 0;

  for (const chunk of chunks) {
    try {
      const embedding =
        await createEmbedding(
          chunk.text
        );

      await VectorDocument.create({
        text:
          chunk.text,

        embedding,

        metadata:
          chunk.metadata,
      });

      storedCount++;
    } catch (error) {
      console.error(
        error.message
      );
    }
  }

  console.log(
    `Stored chunks: ${storedCount}`
  );

  return {
    ...state,
  };
};