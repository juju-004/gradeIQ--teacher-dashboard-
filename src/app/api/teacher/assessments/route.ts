import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import { getSession } from "@/server/actions";
import Assessment from "@/server/models/Assessment";
import StudentAssessmentResult from "@/server/models/StudentAssessmentResult";
import mongoose from "mongoose";
import "@/server/models/Student";
import { Question } from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import {
  gradeOMR,
  gradeText,
} from "@/app/(dashboard)/(teacher)/_grading/gradeOMR";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const { searchParams } = new URL(req.url);
    const assessmentId = searchParams.get("assessmentId");

    if (!assessmentId || !mongoose.Types.ObjectId.isValid(assessmentId)) {
      return NextResponse.json(
        { message: "Invalid assessment ID" },
        { status: 400 },
      );
    }

    // Fetch assessment info
    const assessment = await Assessment.findById(assessmentId)
      .select("name rubric type totalScore")
      .lean();

    if (!assessment) {
      return NextResponse.json(
        { message: "Assessment not found" },
        { status: 404 },
      );
    }

    // Fetch student results
    const results = await StudentAssessmentResult.find({
      assessmentId,
    })
      .select("studentId answers score")
      .populate("studentId", "name")
      .lean();

    const demi = results.map(({ answers, studentId, score }) => ({
      studentId,
      score,
      answers:
        (assessment as any)?.type === "omr"
          ? answers
          : (answers as any[]).map(({ answer, score }) => ({
              text: answer,
              score,
            })),
    }));

    // Merge everything
    return NextResponse.json({ ...assessment, results: demi });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch assessment and results" },
      { status: 500 },
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
    const { name, classId, subjectId, rubric, results, type } = body;

    // ---------- VALIDATION ----------
    if (!schoolId || !name || !classId || !subjectId || !type) {
      throw new Error("Missing assessment fields");
    }

    if (!["omr", "text"].includes(type)) {
      throw new Error("Invalid assessment type");
    }

    // ---------- CALCULATE TOTAL SCORE ----------
    let totalScore = 0;

    if (type === "omr") {
      totalScore = (rubric as string[]).length;
    }

    if (type === "text") {
      totalScore = (rubric as Question[]).reduce((sum, q) => {
        return sum + q.answers.reduce((qSum, a) => qSum + (a.score ?? 0), 0);
      }, 0);
    }

    // ---------- CREATE ASSESSMENT ----------
    const assessment = await Assessment.create({
      name,
      schoolId,
      classId,
      subjectId,
      rubric,
      type,
      totalScore,
    });

    // ---------- CREATE STUDENT RESULTS ----------
    if (Array.isArray(results) && results.length > 0) {
      const gradedResults = results.map((result) => {
        let score = 0;
        if (type === "omr") {
          const graded = gradeOMR(rubric as string[], result?.answers ?? []);
          score = graded;
        }

        if (type === "text") {
          const graded = gradeText(result?.answers ?? []);
          score = graded;
        }
        return {
          assessmentId: assessment._id,
          studentId: result.id,
          answers: result?.answers ?? [],
          score,
        };
      });

      await StudentAssessmentResult.insertMany(gradedResults);
    }

    return NextResponse.json(
      {
        message: "Assessment saved!!",
        assessmentId: assessment._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save assessment" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
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
        { message: "Assessment ID is required" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      return NextResponse.json(
        { message: "Invalid assessment ID" },
        { status: 400 },
      );
    }

    await StudentAssessmentResult.deleteMany({ assessmentId });
    await Assessment.findByIdAndDelete(assessmentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete assessment" },
      { status: 500 },
    );
  }
}
