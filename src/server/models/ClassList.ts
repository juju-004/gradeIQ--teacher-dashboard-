// models/ClassList.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface IClassList extends Document {
  list: string[]; // e.g. "JSS1A", "Grade 4", etc.
  schoolId: string;
}

const ClassListSchema = new Schema<IClassList>(
  {
    list: { type: [String], required: true },
    schoolId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.ClassList ||
  model<IClassList>("ClassList", ClassListSchema);
