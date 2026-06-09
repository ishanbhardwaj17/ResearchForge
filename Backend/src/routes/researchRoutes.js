import express from "express";
import { workflow } from "../graph/workflow.js";
import { v4 as uuidv4 } from "uuid";
import { readUrl } from "../tools/readerTool.js";
import { createEmbedding } from "../rag/embedDocuments.js";
import { chunkDocuments } from "../rag/chunkDocuments.js";
import { addDocumentsToVectorStore, getVectorStoreStats } from "../services/vectorStore.js";
import { probeProviders } from "../services/aiProvider.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  const providers = await probeProviders();

  res.status(200).json({
    success: true,
    providers,
    vectorStore: getVectorStoreStats(),
  });
});

router.post("/ingest", async (req, res) => {
  try {
    const namespace = req.body.namespace || "global";
    const urls = Array.isArray(req.body.urls) ? req.body.urls : [];
    const sourceTexts = Array.isArray(req.body.sourceTexts) ? req.body.sourceTexts : [];
    const documents = [];

    for (const item of sourceTexts) {
      if (!item?.content?.trim()) {
        continue;
      }

      documents.push({
        sectionTitle: item.sectionTitle || "Manual Source",
        sourceTitle: item.title || "Manual Source",
        url: item.url || "",
        content: item.content.trim(),
      });
    }

    for (const url of urls) {
      const content = await readUrl(url);
      if (!content || content.length < 200) {
        continue;
      }

      documents.push({
        sectionTitle: "Imported URL",
        sourceTitle: url,
        url,
        content,
      });
    }

    const chunks = await chunkDocuments(documents);
    const records = [];

    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk.text);
      records.push({
        namespace,
        text: chunk.text,
        embedding,
        metadata: chunk.metadata,
      });
    }

    const stored = await addDocumentsToVectorStore(records);

    res.status(200).json({
      success: true,
      documents: documents.length,
      chunks: chunks.length,
      stored,
      vectorStore: getVectorStoreStats(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post(
  "/plan",
  async (req, res) => {
    try {
      const { query, sourceUrls = [], sourceTexts = [], searchEnabled = true } =
        req.body;

      if (!query?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Query is required",
        });
      }

      const reportId = uuidv4();
      const normalizedSourceTexts = sourceTexts
        .filter((item) => item?.content?.trim())
        .map((item) => ({
          sectionTitle: item.sectionTitle || "User Notes",
          sourceTitle: item.title || "User Notes",
          url: item.url || "",
          content: item.content.trim(),
        }));

      const result =
        await workflow.invoke({
          ...req.body,
          reportId,
          query: query.trim(),
          sourceUrls,
          sourceTexts: normalizedSourceTexts,
          searchEnabled,
        });

      res.status(200).json(
        {
          success: true,
          ...result,
        }
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

export default router;
