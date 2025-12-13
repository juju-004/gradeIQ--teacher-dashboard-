import { model, models, Schema, Types } from "mongoose";

export interface IClass {
  _id?: Types.ObjectId;
  name: string; // e.g., "Grade 5"
  schoolId: string;
  subjects: Types.ObjectId[]; // references to Subject documents
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    schoolId: { type: String, required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject", default: [] }],
  },
  { timestamps: true }
);

export default models.Class || model<IClass>("Class", ClassSchema);
