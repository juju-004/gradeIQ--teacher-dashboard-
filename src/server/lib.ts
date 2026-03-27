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

  // ---------------- CLEAN OCR NOISE ----------------

  let cleaned = text

    // normalize whitespace but keep line breaks
    .replace(/\r/g, "")

    // common OCR issues
    .replace(/¿/g, "")
    .replace(/\|\s*mark/gi, "1 mark")
    .replace(/works?/gi, "marks")

    // fix merged scientific terms
    .replace(/carbondioxide/gi, "Carbon dioxide")

    // normalize brackets
    .replace(/\[\s*/g, "[")
    .replace(/\s*\]/g, "]")

    // empty bracket → 1 mark
    .replace(/\[\]/g, "[1 mark]")
    .replace(/\[\s*mark\s*\]/gi, "[1 mark]")

    // normalize punctuation spacing
    .replace(/\s([.,!?])/g, "$1")

    // collapse multiple spaces
    .replace(/[ \t]+/g, " ")

    .trim();

  // ---------------- SPLIT QUESTIONS ----------------

  const questionBlocks = cleaned
    .split(/(?=\d+[\.\:\)])/)
    .map((q) => q.trim())
    .filter(Boolean);

  const questions = questionBlocks.map((block, index) => {
    const numberMatch = block.match(/^(\d+)[\.\:\)]/);

    const questionNumber = numberMatch
      ? parseInt(numberMatch[1], 10)
      : index + 1;

    const body = block.replace(/^\d+[\.\:\)]\s*/, "");

    // ---------------- DETERMINE SPLIT STRATEGY ----------------

    let answerChunks: string[] = [];

    const hasMarks = /\[\d+\s*mark/i.test(body);

    const hasRoman = /\b(i{1,4}|v|vi{0,3}|ix|x)\)/i.test(body);

    const hasBullets = /[-•]/.test(body);

    if (hasMarks) {
      // best case
      answerChunks = body.split(/(?=\[\d+\s*mark)/i);
    } else if (hasRoman) {
      // split at roman numerals
      answerChunks = body.split(/(?=\(?\s*(?:i{1,4}|v|vi{0,3}|ix|x)\))/i);
    } else if (hasBullets) {
      // split bullets
      answerChunks = body.split(/(?=\s*[-•]\s*)/);
    } else {
      // whitespace / line fallback
      answerChunks = body.split(/\n| {2,}/).filter(Boolean);
    }

    // ---------------- PARSE ANSWERS ----------------

    const answers = answerChunks
      .map((chunk) => {
        const markMatch =
          chunk.match(/\[(\d+)\s*mark[s]?\]/i) ||
          chunk.match(/\((\d+)\s*mark[s]?\)/i);

        const score = markMatch ? parseInt(markMatch[1]) : 1;

        const cleanedAnswer = chunk

          // remove marks
          .replace(/\[(\d+)\s*mark[s]?\]/gi, "")
          .replace(/\((\d+)\s*mark[s]?\)/gi, "")

          // remove roman numerals
          .replace(/^\(?\s*(i{1,4}|v|vi{0,3}|ix|x)\)?/i, "")

          // remove bullet symbols
          .replace(/^[-•]\s*/, "")

          // remove stray brackets
          .replace(/[\[\]()]/g, "")

          .trim();

        if (!cleanedAnswer) return null;

        return {
          text: cleanedAnswer,
          score,
        };
      })
      .filter(Boolean);

    return {
      questionNumber,

      type: answers.length > 1 ? "list" : undefined,

      answers,
    };
  });

  return questions;
}

type RubricMeta = {
  questionNumber: number;
  type?: "list" | "keyword";
};

export function parseOCRToStudentAnswers(text: string, rubric: RubricMeta[]) {
  if (!text) return [];

  // ---------------- CLEAN OCR (Simple Fix) ----------------
  let cleaned = text
    .replace(/\r/g, "") // remove carriage returns
    .replace(/\t/g, " ") // tabs → space
    .replace(/\s{2,}/g, " ") // collapse multiple spaces
    .replace(/\s([.,;:!?])/g, "$1") // remove space before punctuation
    .replace(/\n{2,}/g, "\n") // collapse multiple line breaks
    .trim();

  // ---------------- DETECT QUESTION BLOCKS ----------------
  const blockRegex =
    /(?:^|\n)\s*([0-9]{1,3}|[IlZSoO])\s*\n([\s\S]*?)(?=\n\s*(?:[0-9]{1,3}|[IlZSoO])\s*\n|$)/g;

  const blocks: { questionNumber: number | null; answers: string[] }[] = [];
  let match;

  while ((match = blockRegex.exec(cleaned))) {
    let rawNumber = match[1];

    // fix common OCR number confusions
    rawNumber = rawNumber
      .replace(/[Il]/g, "1")
      .replace(/Z/g, "2")
      .replace(/S/g, "5")
      .replace(/O/g, "0");

    const detectedNumber = parseInt(rawNumber);

    const body = match[2].trim();

    const lines = body
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    // detect if it looks like a list (short lines or bullet points)
    const looksLikeList =
      lines.length > 1 &&
      lines.every(
        (l) => l.length < 60 || /^[•\-*]/.test(l) || /^[a-z]\)/i.test(l),
      );

    blocks.push({
      questionNumber: Number.isFinite(detectedNumber) ? detectedNumber : null,
      answers: looksLikeList
        ? lines.map((l) => l.replace(/^[•\-*\d\)]\s*/, ""))
        : [lines.join(" ")], // keep spaces intact
    });
  }

  // ---------------- FALLBACK IF NO NUMBERS DETECTED ----------------
  if (!blocks.length) {
    return [{ questionNumber: null, answers: [cleaned] }];
  }

  // ---------------- ALIGN WITH RUBRIC TYPE ----------------
  const results = blocks.map((block) => {
    const rubricMatch = rubric.find(
      (r) => r.questionNumber === block.questionNumber,
    );

    if (rubricMatch?.type === "list") {
      block.answers = block.answers.flatMap((a) =>
        a.split("\n").filter(Boolean),
      );
    }

    if (rubricMatch?.type === "keyword") {
      block.answers = [block.answers.join(" ")];
    }

    return block;
  });

  return results;
}
