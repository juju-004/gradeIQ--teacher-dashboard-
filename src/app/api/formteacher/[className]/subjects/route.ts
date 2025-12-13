import Subject from "@/server/models/Subject";
import { getSession } from "@/server/actions";
import { connectDB } from "@/server/db";
import ClassList from "@/server/models/ClassList";
import { NextResponse } from "next/server";
import TeachingAssignment from "@/server/models/TeachingAssignment";
import { Types } from "mongoose";

type ClassWithSubjects = {
  _id: Types.ObjectId;
  name: string;
  subjects: Types.ObjectId[];
};

type Params = {
  params: Promise<{ className: string }>;
};

export async function POST(req: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { className } = await params;
    const { name, teachers } = await req.json();

    if (!name || !Array.isArray(teachers))
      return NextResponse.json(
        { error: "Some fields are required" },
        { status: 400 }
      );

    console.log("yes1");

    // 1️⃣ Find class
    const classData = await ClassList.findOne({
      schoolId: session.schoolId,
      name: className,
    });
    console.log("yes2");

    if (!classData)
      return NextResponse.json({ error: "Class not found" }, { status: 404 });

    // 2️⃣ Find or create subject
    let subject = await Subject.findOne({ name });

    console.log(subject);

    if (!subject) {
      subject = await Subject.create({ name });
    }

    // 3️⃣ Add subject to class if missing
    if (!classData.subjects.includes(subject._id)) {
      classData.subjects.push(subject._id);
      await classData.save();
    }
    console.log("yes4");

    // 4️⃣ Update teaching assignments
    for (const teacherId of teachers) {
      const exists = await TeachingAssignment.findOne({
        schoolId: session.schoolId,
        teacherId,
        classId: classData._id,
        subjectId: subject._id,
      });

      if (!exists) {
        await TeachingAssignment.create({
          schoolId: session.schoolId,
          teacherId,
          classId: classData._id,
          subjectId: subject._id,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST subjectteacher error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { className } = await params;

    // 1️⃣ Find class
    const classData = (await ClassList.findOne(
      { schoolId: session.schoolId, name: className },
      { _id: 1, name: 1, subjects: 1 }
    ).lean()) as ClassWithSubjects | null;

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // 2️⃣ Get subjects
    const subjects = await Subject.find(
      { _id: { $in: classData.subjects } },
      { _id: 1, name: 1 }
    ).lean();

    // 3️⃣ Get teaching assignments for this class
    const assignments = await TeachingAssignment.find({
      schoolId: session.schoolId,
      classId: classData._id,
    })
      .populate("teacherId", "_id name")
      .populate("subjectId", "_id")
      .lean();

    // 4️⃣ Group teachers by subject
    const subjectMap = subjects.map((subject) => {
      const teachers = assignments
        .filter((a) => String(a.subjectId?._id) === String(subject._id))
        .map((a) => a.teacherId);

      return {
        _id: subject._id,
        name: subject.name,
        teachers, // [{ _id, name }]
      };
    });

    console.log(subjectMap);

    return NextResponse.json({
      class: classData.name,
      subjects: subjectMap,
    });
  } catch (error) {
    console.error("GET subjects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { className } = await params;
    const url = new URL(req.url);
    const subjectId = url.searchParams.get("subjectId");

    if (!subjectId) {
      return NextResponse.json(
        { error: "Missing subjectId in query" },
        { status: 400 }
      );
    }

    const { name, teachers } = await req.json();

    if (!name || !Array.isArray(teachers)) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    // 1️⃣ Find class
    const classData = await ClassList.findOne({
      schoolId: session.schoolId,
      name: className,
    });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // 2️⃣ Update subject name
    await Subject.updateOne({ _id: subjectId }, { name });

    // 3️⃣ Handle teacher assignments
    const existingAssignments = await TeachingAssignment.find({
      schoolId: session.schoolId,
      classId: classData._id,
      subjectId,
    });

    const existingTeacherIds = existingAssignments.map((a) =>
      String(a.teacherId)
    );

    // ➕ Add new assignments
    const toAdd = teachers.filter(
      (id: string) => !existingTeacherIds.includes(id)
    );

    if (toAdd.length) {
      await TeachingAssignment.insertMany(
        toAdd.map((teacherId: string) => ({
          schoolId: session.schoolId,
          teacherId,
          classId: classData._id,
          subjectId,
        }))
      );
    }

    // ➖ Remove unassigned teachers
    const toRemove = existingTeacherIds.filter((id) => !teachers.includes(id));

    if (toRemove.length) {
      await TeachingAssignment.deleteMany({
        schoolId: session.schoolId,
        classId: classData._id,
        subjectId,
        teacherId: { $in: toRemove },
      });
    }

    return NextResponse.json({ message: "Subject updated successfully" });
  } catch (error) {
    console.error("PUT /subjects error:", error);
    return NextResponse.json(
      { error: "Failed to update subject" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { className } = await params;
    const url = new URL(req.url);
    const subjectId = url.searchParams.get("subjectId");

    if (!subjectId) {
      return NextResponse.json(
        { error: "Missing subjectId in query" },
        { status: 400 }
      );
    }

    // 1️⃣ Find class
    const classData = await ClassList.findOne({
      schoolId: session.schoolId,
      name: className,
    });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // 3️⃣ Remove subjectId from class's subjects array
    await ClassList.updateOne(
      { _id: classData._id },
      { $pull: { subjects: subjectId } }
    );

    // 4️⃣ Delete all teaching assignments for this subject + class
    await TeachingAssignment.deleteMany({
      schoolId: session.schoolId,
      classId: classData._id,
      subjectId,
    });

    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("DELETE /subjects error:", error);
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 }
    );
  }
}
