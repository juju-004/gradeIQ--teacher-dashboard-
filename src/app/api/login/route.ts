import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/server/db";
import bcrypt from "bcryptjs";
import { getSession } from "@/server/actions";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // set session
  const session = await getSession();
  session.id = String(user._id);
  session.name = user.name;
  session.email = user.email;
  session.roles = user.roles;
  session.schoolId = user.schoolId;
  session.assignedSubjects = user.assignedSubjects;
  session.formClass = user.formClass;
  await session.save();

  return NextResponse.json({ ok: true });
}
