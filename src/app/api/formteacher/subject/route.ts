import { getSession } from "@/server/actions";
import { connectDB } from "@/server/db";
import Subject from "@/server/models/Subject";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Subject name is required" },
        { status: 400 }
      );
    }

    // 2️⃣ Create subject
    const newSubject = await Subject.create({
      name,
      schoolId: session.schoolId,
    });

    return NextResponse.json(
      { message: "Subject created", subject: newSubject },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST subject error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
