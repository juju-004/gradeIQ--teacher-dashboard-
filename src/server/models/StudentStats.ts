// models/StudentStats.ts
import { Schema, model, models } from "mongoose";

const StudentStatsSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  classId: { type: Schema.Types.ObjectId, ref: "ClassList", required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },

  averageScore: Number,
  assessmentCount: Number,

  updatedAt: { type: Date, default: Date.now },
});

export default models.StudentStats || model("StudentStats", StudentStatsSchema);
