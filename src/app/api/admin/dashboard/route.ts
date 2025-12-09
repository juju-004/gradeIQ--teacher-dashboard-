export const dynamic = "force-dynamic";

// app/api/dashboard/route.ts
import { getSession } from "@/server/actions";
import { connectDB, User } from "@/server/db";
import ClassList from "@/server/models/ClassList";
import StudentList from "@/server/models/Student";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const schoolId = session.schoolId;

    // FETCH CLASSES
    const classes = await ClassList.find({ schoolId }).lean();

    // FETCH STAFF (users with any role)
    const staff = await User.find(
      { schoolId, roles: { $exists: true, $not: { $size: 0 } } },
      "-password" // remove password field
    ).lean();

    // STUDENT TOTAL COUNT
    const studentsCount = await StudentList.countDocuments({ schoolId });

    // STUDENTS PER CLASS
    const studentsPerClass = await StudentList.aggregate([
      { $match: { schoolId } },
      {
        $group: {
          _id: "$classId",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      classes,
      staff,
      studentsCount,
      studentsPerClass,
    });
  } catch (err) {
    console.error("Dashboard API Error:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
