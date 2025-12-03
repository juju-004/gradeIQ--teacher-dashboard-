import { getSession } from "@/server/actions";
import { connectDB, User } from "@/server/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.id || !session?.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = context.params;

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
