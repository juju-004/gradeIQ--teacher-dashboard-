// models/ClassList.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface IClassList extends Document {
  name: string; // e.g. "JSS1A", "Grade 4", etc.
  schoolId: string;
}

const ClassListSchema = new Schema<IClassList>(
  {
    name: { type: String, required: true },
    schoolId: { type: String, required: true }, // so schools only see their classes
  },
  { timestamps: true }
);

export default mongoose.models.ClassList ||
  model<IClassList>("ClassList", ClassListSchema);
