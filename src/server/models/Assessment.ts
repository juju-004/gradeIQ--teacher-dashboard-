// models/Assessment.ts
import { Schema, model, models } from "mongoose";

const AssessmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    totalScore: { type: Number, required: true },
    schoolId: {
      type: String,
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "ClassList",
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    rubric: { type: Array, required: true },
  },
  { timestamps: true },
);

export default models.Assessment || model("Assessment", AssessmentSchema);
