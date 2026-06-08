import { StateGraph, START, END } from "@langchain/langgraph";

import { plannerAgent } from "../agents/plannerAgent.js";
import { initialState } from "./state.js";

const graph = new StateGraph({
  channels: {
    query: null,
    researchPlan: null,
  },
});

graph.addNode("planner", plannerAgent);

graph.addEdge(START, "planner");
graph.addEdge("planner", END);

export const workflow = graph.compile();
