import mongoose from "mongoose";

const researchReportSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
    },

    report: {
      type: String,
      required: true,
    },

    sources: [
      {
        title: String,
        url: String,
      },
    ],

    score: {
      type: Number,
      default: 0,
    },

    critique: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ResearchReport", researchReportSchema);
