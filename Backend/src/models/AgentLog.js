import mongoose from "mongoose";

const agentLogSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResearchReport",
    },

    agentName: String,

    input: Object,

    output: Object,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AgentLog", agentLogSchema);
