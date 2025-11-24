import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Activation, connectDB, User } from "@/server/db";
import { getSession } from "@/server/actions";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { school, code, name, email, password } = body;

  if (!school || !code || !name || !email || !password) {
    console.log(school, code, name, email, password);

    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify activation code
  const activation = await Activation.findOne({ activationCode: code });
  if (!activation)
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  if (activation.used)
    return NextResponse.json({ error: "Code already used" }, { status: 400 });

  // Check if email exists
  const existing = await User.findOne({ email });
  if (existing)
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 }
    );

  // Create admin user
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const admin = new User({
    name,
    email,
    passwordHash: hash,
    roles: ["admin"],
    assignedSubjects: [],
    formClass: null,
    school,
  });
  await admin.save();

  // Mark activation as used
  activation.used = true;
  await activation.save();

  // Set session
  const session = await getSession();
  session.id = String(admin._id);
  session.name = admin.name;
  session.email = admin.email;
  session.roles = admin.roles;
  session.assignedSubjects = admin.assignedSubjects;
  session.formClass = admin.formClass;
  await session.save();

  return NextResponse.json({ ok: true });
}
