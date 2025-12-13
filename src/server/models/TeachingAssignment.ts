import { model, models, Schema, Types } from "mongoose";

export interface ITeachingAssignment {
  _id?: Types.ObjectId;
  schoolId: string;
  teacherId: Types.ObjectId; // reference to a Teacher
  classId: Types.ObjectId; // reference to a Class
  subjectId: Types.ObjectId; // reference to a Subject
}

const TeachingAssignmentSchema = new Schema<ITeachingAssignment>(
  {
    schoolId: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  },
  { timestamps: true }
);

export default models.TeachingAssignment ||
  model<ITeachingAssignment>("TeachingAssignment", TeachingAssignmentSchema);
