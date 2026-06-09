import axios from "axios";

export const tavilySearch = async (
  query,
  maxResults = 5
) => {
  try {
    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: process.env.TAVILY_API_KEY,

        query,

        search_depth: "advanced",

        max_results: maxResults,

        include_answer: false,

        include_images: false,
      }
    );

    return response.data.results;
  } catch (error) {
    console.error(
      "Tavily Error:",
      error.response?.data || error.message
    );

    return [];
  }
};

export default {
  invoke: tavilySearch,
};