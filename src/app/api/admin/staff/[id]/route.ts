import { getSession } from "@/server/actions";
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

    const {
      name,
      email,
      roles,
      subjects = [],
      formClass = [],
      password,
    } = body;

    const staff = await User.findById(staffId);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    staff.name = name ?? staff.name;
    staff.email = email ?? staff.email;
    staff.roles = roles ?? staff.roles;
    staff.subjects = subjects ?? staff.subjects;
    staff.formClass = formClass ?? staff.formClass;

    await staff.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.id || !session?.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const deleted = await User.findOneAndDelete({
      _id: userId,
      roles: { $not: { $elemMatch: { $eq: "admin" } } }, // prevent deleting admins
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Staff not found or cannot delete admin" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Staff deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
