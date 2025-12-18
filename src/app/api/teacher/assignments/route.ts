// app/api/teacher/assignments/route.ts
import { getSession } from "@/server/actions";
import { connectDB } from "@/server/db";
import ClassList from "@/server/models/ClassList";
import Subject from "@/server/models/Subject";
import TeachingAssignment from "@/server/models/TeachingAssignment";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const assignments = await TeachingAssignment.find({
      teacherId: session.id,
    });

    const combos = await Promise.all(
      assignments.map(async (a) => {
        const cls = await ClassList.findById(a.classId);
        const subj = await Subject.findById(a.subjectId);
        return {
          value: `${cls?.name ?? "Unknown Class"} - ${
            subj?.name ?? "Unknown Subject"
          }`,
          classId: a.classId,
          subjectId: a.subjectId,
        };
      })
    );

    return NextResponse.json(combos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}
