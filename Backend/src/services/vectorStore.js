import fs from "fs";
import path from "path";

const dataDir = path.resolve(process.cwd(), "data");
const vectorStorePath = path.join(dataDir, "vector-store.json");

function ensureStoreFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(vectorStorePath)) {
    fs.writeFileSync(vectorStorePath, JSON.stringify({ documents: [] }, null, 2));
  }
}

function readStore() {
  ensureStoreFile();
  return JSON.parse(fs.readFileSync(vectorStorePath, "utf8"));
}

function writeStore(store) {
  ensureStoreFile();
  fs.writeFileSync(vectorStorePath, JSON.stringify(store, null, 2));
}

export async function addDocumentsToVectorStore(records) {
  if (!records.length) {
    return 0;
  }

  const store = readStore();
  store.documents.push(...records);
  writeStore(store);
  return records.length;
}

export async function searchVectorStore({
  namespaces = [],
  embedding,
  limit = 10,
  similarityFn,
}) {
  const namespaceSet = new Set(namespaces.filter(Boolean));
  const store = readStore();

  const scored = store.documents
    .filter((doc) => !namespaceSet.size || namespaceSet.has(doc.namespace))
    .map((doc) => ({
      text: doc.text,
      metadata: doc.metadata,
      score: similarityFn(embedding, doc.embedding),
    }))
    .filter((doc) => Number.isFinite(doc.score))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

export function getVectorStoreStats() {
  const store = readStore();
  const namespaces = {};

  for (const document of store.documents) {
    namespaces[document.namespace] = (namespaces[document.namespace] || 0) + 1;
  }

  return {
    totalDocuments: store.documents.length,
    namespaces,
    path: vectorStorePath,
  };
}
