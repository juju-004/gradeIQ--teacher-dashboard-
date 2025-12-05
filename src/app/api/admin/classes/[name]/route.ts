import { getSession } from "@/server/actions";
import { connectDB } from "@/server/db";
import ClassList from "@/server/models/ClassList";
import { NextResponse } from "next/server";

// DELETE /api/classes → Optional
export async function DELETE(
  req: Request,
  context: { params: Promise<{ name: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const schoolId = session.schoolId;
    await connectDB();

    const { name } = await context.params;

    // Pull the class name from the array
    const updated = await ClassList.findOneAndUpdate(
      { schoolId },
      { $pull: { list: name } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Class list not found for this school" },
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
