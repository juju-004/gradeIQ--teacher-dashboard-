import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSession } from "@/server/actions";
import Student from "@/server/models/Student";
import { connectDB } from "@/server/db";
import ClassList from "@/server/models/ClassList";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const subjectId = searchParams.get("subjectId");

    if (!classId || !subjectId) {
      return NextResponse.json(
        { error: "classId and subjectId are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const classDoc = await ClassList.findOne({
      _id: classId,
      schoolId: session.schoolId,
    }).select("name");

    if (!classDoc) {
      throw new Error("Class not found");
    }

    const students = await Student.aggregate([
      {
        $match: {
          className: classDoc.name,
          schoolId: session.schoolId,
        },
      },

      {
        $lookup: {
          from: "studentassessmentresults",
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$studentId", "$$studentId"],
                },
              },
            },

            {
              $lookup: {
                from: "assessments",
                localField: "assessmentId",
                foreignField: "_id",
                as: "assessment",
              },
            },

            { $unwind: "$assessment" },

            {
              $match: {
                "assessment.classId": new mongoose.Types.ObjectId(classId),
                "assessment.subjectId": new mongoose.Types.ObjectId(subjectId),
                "assessment.schoolId": session.schoolId,
              },
            },
          ],
          as: "results",
        },
      },

      {
        $addFields: {
          averageScore: {
            $cond: [
              { $gt: [{ $size: "$results" }, 0] },
              { $avg: "$results.percentage" },
              null,
            ],
          },
          assessmentCount: { $size: "$results" },
        },
      },

      {
        $project: {
          name: 1,
          sex: 1,
          averageScore: { $round: ["$averageScore", 1] },
          assessmentCount: 1,
        },
      },

      { $sort: { name: 1 } },
    ]);

    return NextResponse.json(students);
  } catch (error) {
    // console.error("GET /my-students error:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
