"use server";

import { db } from "@/server/db";
import { SessionData } from "@/server/lib";
import { defaultSession, sessionOptions } from "@/server/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

type RegisterState = {
  error: string | null;
  success: boolean;
};

// ADD THE GETSESSION ACTION
export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  // If user visits for the first time session returns an empty object.
  // Let's add the isLoggedIn property to this object and its value will be the default value which is false
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}

// ADD THE LOGIN ACTION
export async function login(prevState: any, formData: FormData) {
  const session = await getSession();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  await db.connectDB();

  const user = await db.Teacher.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return { error: "Wrong Credentials!" };
  }

  // You can pass any information you want
  session.isLoggedIn = true;
  session.id = user.id;
  session.name = user.name;
  session.school = user.school;
  session.subject = user.subject;
  session.email = user.email;

  await session.save();
  redirect("/");
}

export async function register(prevState: any, formData: FormData) {
  const session = await getSession();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const school = formData.get("school") as string;
  const subject = formData.get("subject") as string;
  const password = formData.get("password") as string;

  await db.connectDB();

  // Check if school already exists
  const existing = await db.Teacher.findOne({ email });
  if (existing) {
    return { error: "This account exists. Please login" };
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create new school
  const newTeacher = await db.Teacher.create({
    name,
    email,
    school,
    subject,
    password: hashedPassword,
  });

  // You can pass any information you want
  session.isLoggedIn = true;
  session.id = newTeacher.id;
  session.name = newTeacher.name;
  session.email = newTeacher.email;
  session.school = newTeacher.school;
  session.subject = newTeacher.subject;

  await session.save();
  redirect("/");
}
