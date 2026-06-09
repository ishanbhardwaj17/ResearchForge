import express from "express";
import { tavilySearch } from "../tools/tavilyTool.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  const results = await tavilySearch(
    "impact of artificial intelligence on education"
  );

  res.json(results);
});

export default router;