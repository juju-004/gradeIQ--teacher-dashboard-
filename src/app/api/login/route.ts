export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/server/db";
import bcrypt from "bcryptjs";
import { getSession } from "@/server/actions";
import { decrypt } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  if (user.password) {
    const decrypted = decrypt(
      user.password.encrypted,
      user.password.iv,
      user.password.tag
    );
    if (decrypted !== password)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
  } else if (user.passwordHash) {
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
  } else {
    throw new Error("No password set for this user");
  }

  // set session
  const session = await getSession();
  session.id = String(user._id);
  session.name = user.name;
  session.email = user.email;
  session.roles = user.roles;
  session.schoolId = user.schoolId;
  session.subjects = user.subjects;
  session.formClass = user.formClass;
  session.schoolName = user.school;
  await session.save();

  return NextResponse.json({ ok: true });
}
