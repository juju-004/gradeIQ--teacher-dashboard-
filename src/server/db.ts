import mongoose, { Document, Model, Schema } from "mongoose";
mongoose.Promise = global.Promise;

// models

export type Role = "admin" | "teacher" | "formTeacher";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  roles: Role[];
  subjects?: string[];
  formClass?: string[]; // e.g., 'SS2B'
  school?: string;
  schoolId: string;
  createdAt: Date;
  password?: {
    encrypted: string;
    iv: string;
    tag: string;
  };
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
    roles: { type: [String], required: true },
    subjects: { type: [String], default: [] },
    formClass: { type: [String], default: [] },
    schoolId: { type: String, required: true },
    school: { type: String },
    passwordHash: { type: String, required: false },
    password: {
      encrypted: { type: String, required: false },
      iv: { type: String, required: false },
      tag: { type: String, required: false },
    },
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
