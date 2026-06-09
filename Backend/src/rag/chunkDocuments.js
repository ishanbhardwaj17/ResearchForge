import { RecursiveCharacterTextSplitter }
from "@langchain/textsplitters";

export const chunkDocuments =
async (documents) => {

  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1000,

      chunkOverlap: 200,
    });

  const chunks = [];

  for (const doc of documents) {
    const splitTexts =
      await splitter.splitText(
        doc.content
      );

    splitTexts.forEach((text) => {
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
  }

  return chunks;
};
