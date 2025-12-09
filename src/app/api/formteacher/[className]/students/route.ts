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
      .select("_id name")
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
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Missing Name" }, { status: 400 });
    }

    await Student.create({ name, className, schoolId: session.schoolId });

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
    const body = await req.json();
    const { students } = body;

    console.log(students);

    if (!students) {
      return NextResponse.json(
        { error: "Student ID and Name is required" },
        { status: 400 }
      );
    }

    students.forEach(async ({ _id, name }: { _id: string; name: string }) => {
      await Student.findOneAndUpdate(
        {
          _id,
          className,
          schoolId: session.schoolId,
        },
        {
          name,
        }
      );
    });

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
    await connectDB();

    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { className } = await params;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    await Student.findOneAndDelete({
      _id: id,
      className,
      schoolId: session.schoolId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
