import { model, models, Schema, Types } from "mongoose";

export interface ISubject {
  _id?: Types.ObjectId;
  name: string; // e.g., "Mathematics"
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default models.Subject || model<ISubject>("Subject", SubjectSchema);
