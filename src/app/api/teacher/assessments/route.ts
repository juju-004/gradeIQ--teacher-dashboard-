import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import { getSession } from "@/server/actions";
import Assessment from "@/server/models/Assessment";
import StudentAssessmentResult from "@/server/models/StudentAssessmentResult";
import { gradeAnswers } from "@/lib/grading";
import mongoose from "mongoose";
import "@/server/models/Student";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const { searchParams } = new URL(req.url);
    const assessmentId = searchParams.get("assessmentId");

    if (!assessmentId) {
      return NextResponse.json(
        { message: "Invalid assessment ID" },
        { status: 400 }
      );
    }
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      return NextResponse.json(
        { message: "Invalid assessment ID" },
        { status: 400 }
      );
    }

    // Fetch assessment info
    const assessment = await Assessment.findById(assessmentId)
      .select("name answerKey")
      .lean();

    if (!assessment) {
      return NextResponse.json(
        { message: "Assessment not found" },
        { status: 404 }
      );
    }

    // Fetch student results
    const results = await StudentAssessmentResult.find({
      assessmentId,
    })
      .select("studentId score percentage answers")
      .populate("studentId", "name")
      .lean();

    // Merge everything
    return NextResponse.json({
      ...assessment,
      results,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch assessment and results" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const body = await req.json();

    const schoolId = session.schoolId;
    const { name, classId, subjectId, answerKey, students } = body;

    // ---------- VALIDATION ----------
    if (!schoolId || !name || !classId || !subjectId || !answerKey) {
      throw new Error("Missing assessment fields");
    }

    // ---------- CREATE ASSESSMENT ----------
    const assessment = await Assessment.create({
      schoolId,
      name,
      classId,
      subjectId,
      answerKey,
    });

    // ---------- CREATE STUDENT RESULTS ----------
    if (Array.isArray(students) && students.length > 0) {
      const results = students.map((student) => {
        const { score, percentage } = gradeAnswers(answerKey, student.answers);

        return {
          assessmentId: assessment._id,
          studentId: student.id,
          answers: student.answers,
          score,
          percentage,
        };
      });

      await StudentAssessmentResult.insertMany(results);
    }

    return NextResponse.json(
      {
        message: "Assessment and results saved successfully",
        assessmentId: assessment._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save assessment" },
      { status: 500 }
    );
  }
}
