export const dynamic = "force-dynamic";

import { decrypt, encrypt } from "@/lib/encryption";
import { getSession } from "@/server/actions";
import { connectDB, User } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const session = await getSession();
  if (!session?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const schoolId = session.schoolId;

  const staff = await User.find({
    schoolId,
    roles: { $not: { $elemMatch: { $eq: "admin" } } },
  }).lean();

  const staffWithDecrypted = staff.map((s) => ({
    ...s,
    password: s.password
      ? decrypt(s.password.encrypted, s.password.iv, s.password.tag)
      : undefined,
  }));

  return NextResponse.json({ staff: staffWithDecrypted });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const schoolId = session.schoolId;

    const body = await req.json();
    const { name, email, roles, formClass = [], password } = body;

    if (!name || !email || !roles || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Staff with this email already exists." },
        { status: 409 }
      );
    }
    const { encrypted, iv, tag } = encrypt(password);
    await User.create({
      name,
      email,
      roles,
      formClass,
      password: { encrypted, iv, tag },
      schoolId,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.id || !session?.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No staff selected" }, { status: 400 });
    }

    const result = await User.deleteMany({
      _id: { $in: ids },
      roles: { $not: { $elemMatch: { $eq: "admin" } } },
    });

    return NextResponse.json({
      message: "Staff deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
