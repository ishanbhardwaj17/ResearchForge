import { StateGraph, START, END } from "@langchain/langgraph";

import { plannerAgent } from "../agents/plannerAgent.js";
import { searchAgent } from "../agents/searchAgent.js";
import { readerAgent } from "../agents/readerAgent.js";
import { ragAgent } from "../agents/ragAgent.js";

import { initialState } from "./state.js";

const channels = {};

Object.keys(initialState).forEach((key) => {
  channels[key] = null;
});

const graph = new StateGraph({
  channels,
});

graph.addNode("planner", plannerAgent);

graph.addNode("search", searchAgent);

graph.addNode("reader", readerAgent);

graph.addNode("rag", ragAgent);

graph.addEdge(START, "planner");

graph.addEdge("planner", "search");

graph.addEdge("search", "reader");

graph.addEdge("reader", "rag");

graph.addEdge("rag", END);

export const workflow = graph.compile();