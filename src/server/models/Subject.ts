import { model, models, Schema, Types } from "mongoose";

// ---------------------
// Subject Interface
// ---------------------
export interface ISubject {
  _id?: Types.ObjectId;
  name: string; // e.g., "Mathematics"
}

// ---------------------
// Subject Schema
// ---------------------
export const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Subject || model<ISubject>("Subject", SubjectSchema);
