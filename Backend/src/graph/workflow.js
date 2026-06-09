import { StateGraph, START, END } from "@langchain/langgraph";

import { plannerAgent } from "../agents/plannerAgent.js";
import { searchAgent } from "../agents/searchAgent.js";
import { initialState } from "./state.js";

const graph = new StateGraph({
  channels: {
    query: null,
    researchPlan: null,
  },
});

graph.addNode("planner", plannerAgent);

graph.addNode("search", searchAgent);

graph.addEdge(START, "planner");

graph.addEdge("planner", "search");

graph.addEdge("search", END);

export const workflow = graph.compile();
