import mongoose from "mongoose";

const reportSchema =
  new mongoose.Schema(
    {
      query: String,

      reportType: String,

      finalReport: String,
    },
    {
      timestamps: true,
    }
  );

export const Report =
  mongoose.model(
    "Report",
    reportSchema
  );