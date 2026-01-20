import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSession } from "@/server/actions";
import { connectDB } from "@/server/db";
import StudentAssessmentResult from "@/server/models/StudentAssessmentResult";
import "@/server/models/Assessment";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const schoolId = session.schoolId;
    const classId = searchParams.get("classId");
    const subjectId = searchParams.get("subjectId");

    if (!schoolId || !classId || !subjectId) {
      return NextResponse.json(
        { message: "Missing required filters" },
        { status: 400 },
      );
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(classId) ||
      !mongoose.Types.ObjectId.isValid(subjectId)
    ) {
      return NextResponse.json(
        { message: "Invalid classId or subjectId" },
        { status: 400 },
      );
    }

    const library = await StudentAssessmentResult.aggregate([
      // Join assessments
      {
        $lookup: {
          from: "assessments",
          localField: "assessmentId",
          foreignField: "_id",
          as: "assessment",
        },
      },

      { $unwind: "$assessment" },

      // Apply filters on assessment fields
      {
        $match: {
          "assessment.schoolId": schoolId,
          "assessment.classId": new mongoose.Types.ObjectId(classId),
          "assessment.subjectId": new mongoose.Types.ObjectId(subjectId),
        },
      },

      // Group results per assessment
      {
        $group: {
          _id: "$assessment._id",
          name: { $first: "$assessment.name" },
          studentsCount: { $sum: 1 },
          averagePercentage: { $avg: "$percentage" },
          takenAt: { $max: "$createdAt" },
        },
      },

      // Shape output
      {
        $project: {
          _id: 0,
          assessmentId: "$_id",
          name: 1,
          studentsCount: 1,
          averagePercentage: { $round: ["$averagePercentage", 1] },
          takenAt: 1,
        },
      },

      // Most recent first
      { $sort: { takenAt: -1 } },
    ]);

    return NextResponse.json(library);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch assessment library" },
      { status: 500 },
    );
  }
}
