// models/Assessment.ts
import { Schema, model, models } from "mongoose";

const AssessmentSchema = new Schema(
  {
    schoolId: {
      type: String,
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
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
    answerKey: { type: [String], required: true },
  },
  { timestamps: true }
);

export default models.Assessment || model("Assessment", AssessmentSchema);
