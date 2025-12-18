// models/Rubric.ts
import { Schema, model, models } from "mongoose";

const RubricSchema = new Schema(
  {
    schoolId: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },

    title: { type: String, required: true },

    criteria: [
      {
        name: { type: String, required: true },
        maxScore: { type: Number, required: true },
        description: String,
      },
    ],

    createdBy: { type: Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

export default models.Rubric || model("Rubric", RubricSchema);
