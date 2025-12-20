import { NextResponse } from "next/server";
import { getSession } from "@/server/actions";
import { connectDB, User } from "@/server/db";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.roles.includes("form teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    // Assuming ONE form class per form teacher
    const formClass = await User.findOne({
      schoolId: session.schoolId,
      _id: session.id,
    }).select("formClass");

    if (!formClass) return NextResponse.json([], { status: 200 });

    return NextResponse.json(formClass.formClass);
  } catch (error) {
    console.error("GET /form-class error:", error);
    return NextResponse.json(
      { error: "Failed to fetch form class" },
      { status: 500 }
    );
  }
}
