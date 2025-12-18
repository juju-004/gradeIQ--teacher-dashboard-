// models/Grade.ts
import { Schema, model, models } from "mongoose";

const GradeSchema = new Schema(
  {
    schoolId: { type: String, required: true },

    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },

    classId: { type: Schema.Types.ObjectId, ref: "ClassList", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },

    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },

    rubricBreakdown: [
      {
        criterion: String,
        score: Number,
        maxScore: Number,
      },
    ],

    gradedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    gradedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Grade || model("Grade", GradeSchema);
