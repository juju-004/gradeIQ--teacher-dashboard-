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

    const data = await ClassList.find({ schoolId }).select("_id name").lean();

    return NextResponse.json({ classes: data || [] });
  } catch (error) {
    console.error("GET classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

// POST /api/classes  → create classes for a school
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const schoolId = session.schoolId;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Class name is required" },
        { status: 400 }
      );
    }

    await ClassList.create({
      schoolId,
      name,
      subjects: [],
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("GET classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { classes } = body;
    const schoolId = session.schoolId;

    if (!classes || !Array.isArray(classes))
      return NextResponse.json(
        { error: "Classes are required" },
        { status: 400 }
      );

    // Update each class by _id and schoolId
    for (const cls of classes) {
      const { _id, name } = cls;
      if (!_id || !name) continue; // skip invalid entries

      await ClassList.updateOne({ _id, schoolId }, { $set: { name } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("UPDATE classes error:", error);
    return NextResponse.json(
      { error: "Failed to update classes" },
      { status: 500 }
    );
  }
}
