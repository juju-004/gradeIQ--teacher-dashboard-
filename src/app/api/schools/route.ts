import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  await db.connectDB();

  const schools = await db.School.find({}, { name: 1 });

  return NextResponse.json(schools);
}
