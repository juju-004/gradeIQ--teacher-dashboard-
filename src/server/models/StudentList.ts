// models/Student.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface IStudent extends Document {
  firstname: string;
  lastname: string;
  gender?: string;
  classId: Schema.Types.ObjectId; // References ClassList
  schoolId: string;
}

const StudentSchema = new Schema<IStudent>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: false },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "ClassList",
      required: true,
    },

    schoolId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  model<IStudent>("Student", StudentSchema);
