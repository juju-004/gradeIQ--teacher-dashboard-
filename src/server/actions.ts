"use server";

import { SessionData } from "@/server/lib";
import { sessionOptions } from "@/server/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ADD THE GETSESSION ACTION
export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  return session;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
