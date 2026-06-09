import { writeResearchReport } from "../services/aiProvider.js";
import { saveReport } from "../services/reportStore.js";

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
    await writeResearchReport(prompt, {
      preferredProvider:
        state.provider,
    });

  await saveReport({
    reportId: state.reportId,
    query: state.query,
    reportType: state.reportType,
    finalReport: response.text,
    provider: response.provider,
    sources: state.retrievedChunks.map((chunk) => chunk.metadata),
  });

  return {
    ...state,
    provider: response.provider,

    finalReport:
      response.text,

    sources:
      state.retrievedChunks.map(
        (chunk) => chunk.metadata
      ),
  };
};
