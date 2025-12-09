import { getSession } from "@/server/actions";
import { connectDB } from "@/server/db";
import ClassList from "@/server/models/ClassList";
import { NextResponse } from "next/server";

// DELETE /api/classes → Optional
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const schoolId = session.schoolId;
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    // Delete the class only if it belongs to the current school
    const deleted = await ClassList.findOneAndDelete({ _id: id, schoolId });

    if (!deleted) {
      return NextResponse.json(
        { error: "Class not found or does not belong to your school" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE classes error:", error);
    return NextResponse.json(
      { error: "Failed to delete class list" },
      { status: 500 }
    );
  }
}
