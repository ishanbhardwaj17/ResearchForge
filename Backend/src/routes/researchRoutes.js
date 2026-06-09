import express from "express";
import { workflow } from "../graph/workflow.js";

const router = express.Router();

router.post(
  "/plan",
  async (req, res) => {
    try {
      const { query } =
        req.body;

      const result =
        await workflow.invoke({
          query,
        });

      res.status(200).json(
        result
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

export default router;