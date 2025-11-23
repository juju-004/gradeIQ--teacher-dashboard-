import mongoose from "mongoose";

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

const schoolSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store hash
  },
  { timestamps: true }
);

const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store hash
    school: { type: String, required: true },
  },
  { timestamps: true }
);

export const db = {
  connectDB,
  School: mongoose.models.School || mongoose.model("School", schoolSchema),
  Teacher: mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema),
};
