import { Schema, model, models } from "mongoose";

const StudentAssessmentResultSchema = new Schema(
  {
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    answers: { type: [String], required: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { timestamps: true }
);

StudentAssessmentResultSchema.index(
  { assessmentId: 1, studentId: 1 },
  { unique: true }
);

// ✅ Export the model
export default models.StudentAssessmentResult ||
  model("StudentAssessmentResult", StudentAssessmentResultSchema);
