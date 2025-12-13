export const dynamic = "force-dynamic";

import { getSession } from "@/server/actions";
import { connectDB, User } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const session = await getSession();
  if (!session?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const schoolId = session.schoolId;

  // Query ONLY teachers, exclude admins automatically
  const teachers = await User.find(
    {
      schoolId,
      roles: { $in: ["teacher"] },
    },
    {
      _id: 1,
      name: 1,
    }
  ).lean();

  return NextResponse.json({ teachers });
}
