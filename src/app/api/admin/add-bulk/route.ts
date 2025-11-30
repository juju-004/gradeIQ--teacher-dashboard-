import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB, User } from "@/server/db";
import { getSession } from "@/server/actions";
import ClassList from "@/server/models/ClassList";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { classes, staffList } = await req.json();
    const schoolId = session.schoolId;

    if (!classes || !Array.isArray(classes)) {
      return NextResponse.json(
        { message: "Classes must be an array" },
        { status: 400 }
      );
    }
    await ClassList.create({
      list: classes,
      schoolId,
    });

    /* ---------------------------
       SAVE STAFF (Users)
    --------------------------- */
    for (const staff of staffList) {
      const passwordHash = await bcrypt.hash(staff.email.split("@")[0], 10);

      await User.create({
        name: staff.name,
        email: staff.email,
        roles: staff.roles,
        assignedSubjects: staff.subject || null,
        formClass: staff.formClass || null,
        schoolId,
        passwordHash,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
