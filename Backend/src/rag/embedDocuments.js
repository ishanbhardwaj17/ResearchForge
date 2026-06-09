import { embedText } from "../services/aiProvider.js";

export const createEmbedding = async (text, options = {}) => {
  return embedText(text, options);
};
