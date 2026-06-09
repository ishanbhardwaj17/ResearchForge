import { llm } from "../config/gemini.js";

import { Report } from "../models/Report.js";

export const writerAgent = async (state) => {
  const context = state.retrievedChunks
    .map((chunk, index) => {
      return `
Source ${index + 1}
Section: ${chunk.metadata.sectionTitle}

Content:
${chunk.text}
`;
    })
    .join("\n\n");

  const prompt = `
You are a professional research writer.

Research Topic:
${state.query}

Report Type:
${state.reportType}

Use the provided context to write a detailed research report.

Requirements:

- Introduction
- Main Findings
- Analysis
- Challenges / Limitations
- Future Outlook
- Conclusion

Context:

${context}
`;

  const response =
    await llm.invoke(prompt);

  await Report.create({
    query: state.query,

    reportType:
      state.reportType,

    finalReport:
      response.content,
  });

  return {
    ...state,

    finalReport:
      response.content,
  };
};