import axios from "axios";

export const readUrl = async (url) => {
  try {
    const cleanUrl = url.replace(
      /^https?:\/\//,
      ""
    );

    const response =
      await axios.get(
        `https://r.jina.ai/http://${cleanUrl}`
      );

    return response.data;
  } catch (error) {
    console.error(
      "Reader Error:",
      error.message
    );

    return "";
  }
};