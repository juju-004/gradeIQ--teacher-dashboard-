import { parseOCRToQuestions, parseOCRToStudentAnswers } from "@/server/lib";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type RubricMeta = {
  questionNumber: number;
  type?: "list" | "keyword";
};

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const mode = form.get("mode") as string;
    const rubricMetaJSON = form.get("rubricMeta") as string;

    const rubricMeta: RubricMeta[] = rubricMetaJSON
      ? JSON.parse(rubricMetaJSON)
      : [];

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const data = new FormData();

    data.append("includeSubScan", "0");
    data.append("srcImg", new Blob([buffer]), file.name);
    data.append("Session", "string");

    const response = await axios.post(
      "https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/",
      data,
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
          "x-rapidapi-host": "pen-to-print-handwriting-ocr.p.rapidapi.com",
        },
      },
    );

    const rawText = response.data.value;

    let parsed;

    if (mode === "rubric") parsed = parseOCRToQuestions(rawText);
    else parsed = parseOCRToStudentAnswers(rawText, rubricMeta);

    console.log(parsed);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}
