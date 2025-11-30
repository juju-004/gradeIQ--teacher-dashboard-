import mongoose, { Document, Model, Schema } from "mongoose";
mongoose.Promise = global.Promise;

// models

export type Role = "admin" | "teacher" | "formTeacher";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  assignedSubjects?: string[]; // subject names or ids
  formClass?: string | null; // e.g., 'SS2B'
  school?: string;
  schoolId: string;
  createdAt: Date;
}

export interface IActivation extends Document {
  schoolName: string;
  activationCode: string;
  expiresAt: Date;
  used: boolean;
  createdBy?: string; // developer who created it (optional)
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], required: true, default: ["teacher"] },
    assignedSubjects: { type: [String], default: [] },
    formClass: { type: String, default: null },
    school: { type: String },
    schoolId: { type: String, required: true },
  },
  { timestamps: true }
);

const ActivationSchema = new Schema<IActivation>(
  {
    activationCode: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Activation: Model<IActivation> =
  mongoose.models.Activation ||
  mongoose.model<IActivation>("Activation", ActivationSchema);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};
