// src/tools/tavilyTool.js

import axios from "axios";

export const tavilySearch = async (query) => {
  try {
    const response = await axios.post("https://api.tavily.com/search", {
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "advanced",
      max_results: 5,
      include_answer: false,
      include_images: false,
    });

    return response.data.results;
  } catch (error) {
    console.error(
      "Tavily Search Error:",
      error.response?.data || error.message,
    );

    return [];
  }
};

export default {
  invoke: tavilySearch,
};