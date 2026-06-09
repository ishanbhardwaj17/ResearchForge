import { RecursiveCharacterTextSplitter }
from "@langchain/textsplitters";

const MAX_TOTAL_CHUNKS = 48;

export const chunkDocuments =
async (documents) => {

  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1400,

      chunkOverlap: 120,
    });

  const chunks = [];

  for (const doc of documents) {
    const splitTexts =
      await splitter.splitText(
        doc.content
      );

    splitTexts.forEach((text) => {
      if (chunks.length >= MAX_TOTAL_CHUNKS) {
        return;
      }

      chunks.push({
        text,

        metadata: {
          sourceTitle:
            doc.sourceTitle,

          sectionTitle:
            doc.sectionTitle,

          url:
            doc.url,
        },
      });
    });

    if (chunks.length >= MAX_TOTAL_CHUNKS) {
      break;
    }
  }

  return chunks;
};
