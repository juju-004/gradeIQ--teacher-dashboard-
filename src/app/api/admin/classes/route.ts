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

// POST /api/classes  → create initial class list
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { schoolId, classes } = body;

    if (!schoolId || !classes) {
      return NextResponse.json(
        { error: "schoolId and classes are required" },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await ClassList.findOne({ schoolId });

    if (existing) {
      return NextResponse.json(
        { error: "Class list already exists for this school" },
        { status: 409 }
      );
    }

    await ClassList.create({
      list: classes,
      schoolId,
    });

    return NextResponse.json({ success: true, message: "Classes saved" });
  } catch (error) {
    console.error("POST classes error:", error);
    return NextResponse.json(
      { error: "Failed to save classes" },
      { status: 500 }
    );
  }
}

// PUT /api/classes  → update class list
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { schoolId, classes } = body;

    if (!schoolId || !classes) {
      return NextResponse.json(
        { error: "schoolId and classes are required" },
        { status: 400 }
      );
    }

    const updated = await ClassList.findOneAndUpdate(
      { schoolId },
      { list: classes },
      { new: true }
    );

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("UPDATE classes error:", error);
    return NextResponse.json(
      { error: "Failed to update classes" },
      { status: 500 }
    );
  }
}

// DELETE /api/classes → Optional
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json(
        { error: "schoolId is required" },
        { status: 400 }
      );
    }

    await ClassList.deleteOne({ schoolId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE classes error:", error);
    return NextResponse.json(
      { error: "Failed to delete class list" },
      { status: 500 }
    );
  }
}
