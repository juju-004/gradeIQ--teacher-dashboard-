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
    const {
      name,
      email,
      roles,
      assignedSubjects = [],
      formClass = [],
      password,
    } = body;

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
      assignedSubjects,
      formClass: formClass.join(","),
      password: { encrypted, iv, tag },
      schoolId,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const staffId = params.id;
    const body = await req.json();

    const { name, email, roles, assignedSubjects = [], formClass = [] } = body;

    const staff = await User.findById(staffId);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    staff.name = name ?? staff.name;
    staff.email = email ?? staff.email;
    staff.roles = roles ?? staff.roles;
    staff.assignedSubjects = assignedSubjects ?? staff.assignedSubjects;
    staff.formClass = formClass ?? staff.formClass;

    await staff.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  try {
    await connectDB();

    console.log("yes");
    const session = await getSession();
    if (!session?.id || !session?.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;
    console.log(userId);

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
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
