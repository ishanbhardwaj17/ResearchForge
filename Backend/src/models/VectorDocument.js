import mongoose from "mongoose";

const vectorDocumentSchema =
  new mongoose.Schema(
    {
      reportId: {
        type: String,
        required: true,
        index: true,
      },

      text: {
        type: String,
        required: true,
      },

      embedding: {
        type: [Number],
        required: true,
      },

      metadata: {
        sourceTitle: String,

        sectionTitle: String,

        url: String,
      },
    },
    {
      timestamps: true,
    }
  );

export const VectorDocument =
  mongoose.model(
    "VectorDocument",
    vectorDocumentSchema
  );
