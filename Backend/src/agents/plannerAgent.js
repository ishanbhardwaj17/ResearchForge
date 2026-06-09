import { createStructuredPlan } from "../services/aiProvider.js";

export const plannerAgent = async (state) => {
  const result = await createStructuredPlan(state.query);

  return {
    ...state,
    provider: result.provider,
    reportType: result.plan.reportType,
    researchPlan: result.plan.sections,
  };
};
