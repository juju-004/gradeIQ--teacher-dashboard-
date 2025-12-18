// models/Assessment.ts
import { Schema, model, models } from "mongoose";

const AssessmentSchema = new Schema(
  {
    schoolId: { type: String, required: true },

    title: { type: String, required: true },
    type: { type: String, enum: ["Test", "Assignment", "Exam"] },

    classId: { type: Schema.Types.ObjectId, ref: "ClassList", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },

    rubricId: { type: Schema.Types.ObjectId, ref: "Rubric" },

    maxScore: { type: Number, required: true },
    dueDate: Date,

    createdBy: { type: Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

export default models.Assessment || model("Assessment", AssessmentSchema);
