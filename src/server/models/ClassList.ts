import { Schema } from "mongoose";

interface IClass {
  name: string; // e.g., "Grade 5"
  subjects: string[]; // e.g., ["Math", "English"]
}

interface IClassList {
  schoolId: string;
  list: IClass[];
}

const ClassListSchema = new Schema<IClassList>(
  {
    schoolId: { type: String, required: true, unique: true },
    list: [
      {
        name: { type: String, required: true },
        subjects: { type: [String], default: [] },
      },
    ],
  },
  { timestamps: true }
);

export default ClassListSchema;
