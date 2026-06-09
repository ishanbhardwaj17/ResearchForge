// routes/testRoute.js

import express from "express";
import { tavilySearch } from "../tools/tavilyTool.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  const results = await tavilySearch("impact of ai on education");

  res.json(results);
});

export default router;
