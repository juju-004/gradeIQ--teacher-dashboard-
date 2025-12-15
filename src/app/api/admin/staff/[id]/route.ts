import { encrypt } from "@/lib/encryption";
import { connectDB, User } from "@/server/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: staffId } = await context.params;
    const body = await req.json();

    const { name, email, roles, formClass = [], password } = body;

    const staff = await User.findById(staffId);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    staff.name = name ?? staff.name;
    staff.email = email ?? staff.email;
    staff.roles = roles ?? staff.roles;
    staff.formClass = formClass ?? staff.formClass;
    staff.password = password ? encrypt(password) : staff.password;

    await staff.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
