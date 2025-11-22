"use server";

import { db } from "@/server/db";
import { SessionData } from "@/server/lib";
import { defaultSession, sessionOptions } from "@/server/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

// ADD THE GETSESSION ACTION
export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

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
  redirect("/auth/school/login");
}

// ADD THE LOGIN ACTION
export async function loginAsTeacher(prevState: any, formData: FormData) {
  const session = await getSession();

  const school = formData.get("school") as string;
  const password = formData.get("password") as string;

  await db.connectDB();

  const user = await db.Teacher.findOne({ school });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return { error: "Wrong Credentials!" };
  }

  // You can pass any information you want
  session.isLoggedIn = true;
  session.id = user.id;
  session.name = user.name;
  session.role = "teacher";

  await session.save();
  redirect("/");
}

export async function loginAsSchool(prevState: any, formData: FormData) {
  const session = await getSession();

  const name = formData.get("school") as string;
  const password = formData.get("password") as string;

  await db.connectDB();

  const user = await db.School.findOne({ name });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return { error: "Wrong Credentials!" };
  }

  // You can pass any information you want
  session.isLoggedIn = true;
  session.id = user.id;
  session.name = user.name;
  session.role = "school";

  await session.save();
  redirect("/school");
}

export async function register(prevState: any, formData: FormData) {
  const session = await getSession();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await db.connectDB();

  // Check if school already exists
  const existing = await db.School.findOne({ email });
  if (existing) {
    return { error: "School already exists" };
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create new school
  const newSchool = await db.School.create({
    name,
    email,
    password: hashedPassword,
  });

  // You can pass any information you want
  session.isLoggedIn = true;
  session.id = newSchool.id;
  session.name = newSchool.name;
  session.role = "school";

  await session.save();
  redirect("/school");
}
