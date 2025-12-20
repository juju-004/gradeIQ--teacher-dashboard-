import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSession } from "@/server/actions";
import Student from "@/server/models/Student";
import { connectDB } from "@/server/db";

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

    const students = await Student.aggregate([
      {
        $match: {
          classId: new mongoose.Types.ObjectId(classId),
          schoolId: session.schoolId,
        },
      },

      {
        $lookup: {
          from: "grades",
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$studentId", "$$studentId"] },
                    { $eq: ["$classId", new mongoose.Types.ObjectId(classId)] },
                    {
                      $eq: [
                        "$subjectId",
                        new mongoose.Types.ObjectId(subjectId),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "grades",
        },
      },

      {
        $addFields: {
          averageScore: {
            $cond: [
              { $gt: [{ $size: "$grades" }, 0] },
              { $avg: "$grades.score" },
              null,
            ],
          },
          assessmentCount: { $size: "$grades" },
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

    return NextResponse.json({ students });
  } catch (error) {
    console.error("GET /my-students error:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
