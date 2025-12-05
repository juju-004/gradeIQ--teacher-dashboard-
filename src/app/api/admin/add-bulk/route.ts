import { NextResponse } from "next/server";
import { connectDB, User } from "@/server/db";
import { getSession } from "@/server/actions";
import ClassList from "@/server/models/ClassList";
import { encrypt, generatePassword } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.id || !session?.schoolName)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { classes, staffList } = await req.json();
    const schoolId = session.schoolId;
    const school = session.schoolName;

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
      const password = generatePassword(school);
      const { encrypted, iv, tag } = encrypt(password);

      await User.create({
        name: staff.name,
        email: staff.email,
        roles: staff.roles,
        subjects: staff.subjects.split(",") || [],
        formClass: staff.formClass || [],
        schoolId,
        password: { encrypted, iv, tag },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
