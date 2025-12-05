import { isAxiosError } from "axios";
import { SessionOptions } from "iron-session";

export interface SessionData {
  id: string;
  name: string;
  email: string;
  roles: Array<"admin" | "teacher" | "formTeacher">;
  subjects?: string[];
  formClass?: string[];
  schoolId: string;
  schoolName?: string;
}

export const sessionOptions: SessionOptions = {
  // You need to create a secret key at least 32 characters long.
  password: process.env.SESSION_SECRET!,
  cookieName: "gradeiq-session",
  cookieOptions: {
    httpOnly: true,
    // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
    secure: process.env.NODE_ENV === "production",
  },
};

export const filterError = (err: unknown): string => {
  const def = "Something went wrong";

  return isAxiosError(err)
    ? err.response?.data?.error ?? err.response?.data ?? def
    : def;
};
