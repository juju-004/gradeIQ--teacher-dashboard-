import { isAxiosError } from "axios";
import { SessionOptions } from "iron-session";

export interface SessionData {
  id: string;
  name: string;
  email: string;
  roles: Array<"admin" | "teacher" | "form teacher">;
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
    ? (err.response?.data?.error ?? err.response?.data ?? def)
    : def;
};

export function parseOCRToQuestions(text: string) {
  if (!text) return [];

  let cleaned = text
    .replace(/\s+/g, " ")
    .replace(/\s([.,!?])/g, "$1")
    .trim();

  const questionBlocks = cleaned
    .split(/(?=\d+[\.\:\)])/)
    .map((q) => q.trim())
    .filter(Boolean);

  const questions = questionBlocks.map((block, index) => {
    // ✅ Extract question number
    const numberMatch = block.match(/^(\d+)[\.\:\)]/);
    const questionNumber = numberMatch
      ? parseInt(numberMatch[1], 10)
      : index + 1; // fallback

    // Remove number from body
    const body = block.replace(/^\d+[\.\:\)]\s*/, "");

    let rawAnswers = body
      .split(/(?=\b([ivxlcdm]+|[a-z])\))|(?=\s[-•]\s)/gi)
      .map((a) => a.trim())
      .filter(Boolean);

    if (rawAnswers.length === 0) {
      rawAnswers = [body];
    }

    const answers = rawAnswers.map((answer) => {
      let marks = 0;

      const markMatch =
        answer.match(/\((\d+)\s*marks?\)/i) ||
        answer.match(/\[(\d+)\]/) ||
        answer.match(/(\d+)\s*marks?/i) ||
        answer.match(/(\d+)m/i);

      if (markMatch) {
        marks = parseInt(markMatch[1]);
      } else {
        marks = 1;
      }

      const cleanedAnswer = answer
        .replace(/\((\d+)\s*marks?\)/gi, "")
        .replace(/\[(\d+)\]/g, "")
        .replace(/(\d+)\s*marks?/gi, "")
        .replace(/(\d+)m/gi, "")
        .replace(/^(i{1,4}|[a-z])\)/i, "")
        .replace(/^[-•]\s*/, "")
        .trim();

      return {
        text: cleanedAnswer,
        score: marks,
      };
    });

    return {
      questionNumber, // ✅ NEW
      type: answers.length > 1 ? "list" : undefined,
      answers,
    };
  });

  return questions;
}

export function parseOCRToStudentAnswers(text: string) {
  const parsedQuestions = parseOCRToQuestions(text);

  return parsedQuestions.map((q, index) => {
    const questionNumber = index + 1;
    const answers = q.answers.map((a) => a.text.trim()).filter(Boolean);

    return {
      questionNumber,
      answers,
    };
  });
}
