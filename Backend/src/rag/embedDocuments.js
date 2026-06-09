import { embedText, embedTexts as batchEmbedTexts } from "../services/aiProvider.js";

export const createEmbedding = async (text, options = {}) => {
  return embedText(text, options);
};

export const embedTexts = async (texts, options = {}) => {
  return batchEmbedTexts(texts, options);
};
