import dotenv from "dotenv";

dotenv.config();

const PROVIDERS = ["gemini", "mistral"];

function configuredProviders() {
  return PROVIDERS.filter((provider) => {
    if (provider === "gemini") {
      return Boolean(process.env.GEMINI_API_KEY);
    }

    if (provider === "mistral") {
      return Boolean(process.env.MISTRAL_API_KEY);
    }

    return false;
  });
}

function normalizeJsonResponse(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts
    .map((part) => part.text || "")
    .join("")
    .trim();
}

function extractMistralText(data) {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => item?.text || "")
      .join("")
      .trim();
  }

  return "";
}

async function callGemini(prompt, systemInstruction) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: systemInstruction
          ? {
              parts: [{ text: systemInstruction }],
            }
          : undefined,
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = extractGeminiText(data);

  if (!text) {
    throw new Error("Gemini returned empty content");
  }

  return text;
}

async function callMistral(prompt, systemInstruction) {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      temperature: 0.3,
      messages: [
        ...(systemInstruction
          ? [{ role: "system", content: systemInstruction }]
          : []),
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = extractMistralText(data);

  if (!text) {
    throw new Error("Mistral returned empty content");
  }

  return text;
}

async function embedWithGemini(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text }],
        },
        outputDimensionality: 768,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini embedding failed with status ${response.status}`);
  }

  const data = await response.json();
  const values = data?.embedding?.values;

  if (!Array.isArray(values) || !values.length) {
    throw new Error("Gemini embedding returned no vector");
  }

  return values;
}

async function embedWithMistral(text) {
  const response = await fetch("https://api.mistral.ai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-embed",
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral embedding failed with status ${response.status}`);
  }

  const data = await response.json();
  const values = data?.data?.[0]?.embedding;

  if (!Array.isArray(values) || !values.length) {
    throw new Error("Mistral embedding returned no vector");
  }

  return values;
}

function fallbackPlan(query) {
  const baseQueries = [
    `${query} overview`,
    `${query} market analysis`,
    `${query} recent developments`,
  ];

  return {
    reportType: "overview",
    sections: [
      {
        title: "Introduction and Scope",
        objective: `Define the scope and background for ${query}.`,
        importance: 5,
        researchQuestions: [
          `What is ${query}?`,
          `Why does ${query} matter now?`,
          `What are the core terms and assumptions?`,
        ],
        keywords: [query, "background", "overview"],
        searchQueries: baseQueries,
        expectedSources: ["industry_reports", "news_articles"],
      },
      {
        title: "Current Landscape",
        objective: `Map the present state of ${query}.`,
        importance: 5,
        researchQuestions: [
          `Who are the major actors in ${query}?`,
          `What patterns define the current landscape?`,
          `Which segments are growing or changing fastest?`,
        ],
        keywords: [query, "current landscape", "ecosystem"],
        searchQueries: baseQueries,
        expectedSources: ["industry_reports", "case_studies"],
      },
      {
        title: "Evidence and Use Cases",
        objective: `Collect concrete examples and evidence related to ${query}.`,
        importance: 4,
        researchQuestions: [
          `What real-world examples best explain ${query}?`,
          `What measurable outcomes are reported?`,
          `Which use cases are most relevant?`,
        ],
        keywords: [query, "use cases", "evidence"],
        searchQueries: baseQueries,
        expectedSources: ["case_studies", "news_articles"],
      },
      {
        title: "Challenges and Risks",
        objective: `Identify limitations, barriers, and risks around ${query}.`,
        importance: 4,
        researchQuestions: [
          `What are the biggest risks?`,
          `What implementation barriers exist?`,
          `Where are the evidence gaps?`,
        ],
        keywords: [query, "risks", "challenges"],
        searchQueries: baseQueries,
        expectedSources: ["government_reports", "news_articles"],
      },
      {
        title: "Future Outlook",
        objective: `Assess likely future directions for ${query}.`,
        importance: 4,
        researchQuestions: [
          `What trends are shaping the future of ${query}?`,
          `What scenarios are most plausible?`,
          `What should stakeholders watch next?`,
        ],
        keywords: [query, "future", "trends"],
        searchQueries: baseQueries,
        expectedSources: ["industry_reports", "research_papers"],
      },
    ],
  };
}

export async function generateText(prompt, options = {}) {
  const {
    preferredProvider,
    systemInstruction,
  } = options;

  const providers = [
    preferredProvider,
    ...configuredProviders().filter((provider) => provider !== preferredProvider),
  ].filter(Boolean);

  let lastError;

  for (const provider of providers) {
    try {
      const text =
        provider === "gemini"
          ? await callGemini(prompt, systemInstruction)
          : await callMistral(prompt, systemInstruction);

      return {
        provider,
        text,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("No configured AI provider is available");
}

export async function embedText(text, options = {}) {
  const providers = [
    options.preferredProvider,
    ...configuredProviders().filter((provider) => provider !== options.preferredProvider),
  ].filter(Boolean);

  let lastError;

  for (const provider of providers) {
    try {
      return provider === "gemini"
        ? await embedWithGemini(text)
        : await embedWithMistral(text);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("No configured embedding provider is available");
}

export async function createStructuredPlan(query) {
  const prompt = `
Return valid JSON only.

Create a research planning object for the topic below.

Topic:
${query}

Schema:
{
  "reportType": "overview | comparative_analysis | technical_research | market_research | policy_analysis | trend_analysis",
  "sections": [
    {
      "title": "string",
      "objective": "string",
      "importance": 1,
      "researchQuestions": ["string", "string", "string"],
      "keywords": ["string", "string", "string"],
      "searchQueries": ["string", "string", "string"],
      "expectedSources": ["research_papers | industry_reports | government_reports | news_articles | case_studies"]
    }
  ]
}

Rules:
- Create exactly 5 sections.
- Each section must have exactly 3 researchQuestions.
- Each section must have exactly 3 keywords.
- Each section must have exactly 3 searchQueries.
- expectedSources must include 1 to 3 values.
- Avoid overlap across sections.
`.trim();

  try {
    const result = await generateText(prompt, {
      systemInstruction:
        "You are a senior research planner. Output JSON only with no markdown fences.",
    });

    const plan = JSON.parse(normalizeJsonResponse(result.text));

    if (!Array.isArray(plan.sections) || plan.sections.length < 5) {
      throw new Error("Structured plan is incomplete");
    }

    return {
      provider: result.provider,
      plan,
    };
  } catch (error) {
    return {
      provider: configuredProviders()[0] || "fallback",
      plan: fallbackPlan(query),
    };
  }
}

export async function writeResearchReport(prompt, options = {}) {
  return generateText(prompt, {
    ...options,
    systemInstruction:
      "You are a professional research writer. Write a clear, well-structured, citation-aware report grounded in the provided context.",
  });
}

export async function probeProviders() {
  const providers = configuredProviders();
  const results = [];

  for (const provider of providers) {
    try {
      const result = await generateText("Reply with the single word READY.", {
        preferredProvider: provider,
      });
      results.push({
        provider,
        ok: true,
        sample: result.text.slice(0, 40),
      });
    } catch (error) {
      results.push({
        provider,
        ok: false,
        error: error.message,
      });
    }
  }

  return results;
}
