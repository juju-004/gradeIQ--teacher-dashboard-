import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import { getSession } from "@/server/actions";
import Assessment from "@/server/models/Assessment";
import StudentAssessmentResult from "@/server/models/StudentAssessmentResult";
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

    if (!assessmentId || !mongoose.Types.ObjectId.isValid(assessmentId)) {
      return NextResponse.json(
        { message: "Invalid assessment ID" },
        { status: 400 },
      );
    }

    // Fetch assessment info
    const assessment = await Assessment.findById(assessmentId)
      .select("name rubric type")
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
      .select("studentId answers")
      .populate("studentId", "name")
      .lean();

    console.log({ ...assessment, results });

    // Merge everything
    return NextResponse.json({ ...assessment, results });
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
    if (!schoolId || !name || !classId || !subjectId) {
      throw new Error("Missing assessment fields");
    }

    // ---------- CREATE ASSESSMENT ----------
    const assessment = await Assessment.create({
      name,
      schoolId,
      classId,
      subjectId,
      rubric,
      type,
    });

    // ---------- CREATE STUDENT RESULTS ----------
    if (Array.isArray(results) && results.length > 0) {
      const mergedResults = results.map((result) => {
        return {
          assessmentId: assessment._id,
          studentId: result.id,
          answers: result?.answers ?? [],
        };
      });

      await StudentAssessmentResult.insertMany(mergedResults);
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

    console.log(assessmentId);
    console.log("yes 1");

    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      return NextResponse.json(
        { message: "Invalid assessment ID" },
        { status: 400 },
      );
    }

    console.log("yes 2");
    // Delete student results first (important)
    await StudentAssessmentResult.deleteMany({ assessmentId });
    console.log("yes 3");

    // Delete assessment
    await Assessment.findByIdAndDelete(assessmentId);
    console.log("yes 4");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete assessment" },
      { status: 500 },
    );
  }
}
