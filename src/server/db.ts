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

schoolSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.password;
  },
});

const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store hash
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
  },
  { timestamps: true }
);

teacherSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.password;
  },
});

export const db = {
  connectDB,
  School: mongoose.models.School || mongoose.model("School", schoolSchema),
  Teacher: mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema),
};
