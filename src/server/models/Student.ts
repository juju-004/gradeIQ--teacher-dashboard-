import { Schema, model, models } from "mongoose";

export interface IStudent {
  name: string;
  className: string; // e.g. "Grade 5"
  schoolId: string;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    className: { type: String, required: true },
    schoolId: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Student || model<IStudent>("Student", StudentSchema);
