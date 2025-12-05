export const dynamic = "force-dynamic";

import { getSession } from "@/server/actions";
import { connectDB } from "@/server/db";
import ClassList from "@/server/models/ClassList";
import { NextResponse } from "next/server";

// GET /api/classes  → fetch classes for a school
export async function GET() {
  try {
    await connectDB();
    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const schoolId = session.schoolId;

    const data = await ClassList.findOne({ schoolId }).lean();

    return NextResponse.json({ classes: data || [] });
  } catch (error) {
    console.error("GET classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

// PUT /api/classes  → update class list
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const { classes } = body;
    const schoolId = session.schoolId;

    if (!classes)
      return NextResponse.json(
        { error: "Classes are required" },
        { status: 400 }
      );

    await ClassList.findOneAndUpdate(
      { schoolId },
      { list: classes },
      { new: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("UPDATE classes error:", error);
    return NextResponse.json(
      { error: "Failed to update classes" },
      { status: 500 }
    );
  }
}
