import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import { getSession } from "@/server/actions";
import Student from "@/server/models/Student";

type Params = {
  params: Promise<{ className: string }>;
};

// GET ALL STUDENTS
export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { className } = await params;

    const students = await Student.find({
      className,
      schoolId: session.schoolId,
    })
      .select("_id name sex")
      .lean();

    return NextResponse.json({ students });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// CREATE STUDENT
export async function POST(req: Request, { params }: Params) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { className } = await params;
    const body = await req.json();
    const { name, sex } = body;

    console.log(sex);

    if (!name || !sex) {
      return NextResponse.json({ error: "Missing Name" }, { status: 400 });
    }

    await Student.create({ name, className, schoolId: session.schoolId, sex });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

// UPDATE STUDENT
export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { className } = await params;
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const { name, sex } = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    if (!name || !sex) {
      return NextResponse.json(
        { error: "name and sex are required" },
        { status: 400 }
      );
    }

    const student = await Student.findOne({
      _id: studentId,
      className,
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found in this class" },
        { status: 404 }
      );
    }

    student.name = name;
    student.sex = sex;
    await student.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE STUDENT
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { className } = await params;
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No student IDs provided" },
        { status: 400 }
      );
    }

    const result = await Student.deleteMany({
      _id: { $in: ids },
      className, // or classId if you use that field
    });

    return NextResponse.json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete students" },
      { status: 500 }
    );
  }
}
