import { NextRequest, NextResponse } from "next/server";
import { Jimp, intToRGBA } from "jimp";

export const runtime = "nodejs";

function measureDarkness(
  image: any,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  let dark = 0;
  let total = 0;

  for (let px = x; px < x + w; px++) {
    for (let py = y; py < y + h; py++) {
      const color = image.getPixelColor(px, py);
      const { r } = intToRGBA(color);

      if (r < 120) dark++;

      total++;
    }
  }

  return dark / total;
}

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const image = await Jimp.read(buffer);

  image.resize({ w: 800 }); // normalize width
  image.greyscale();

  const answers: Record<number, string | null> = {};

  const startX = 200;
  const startY = 150;

  const optionSpacing = 60;
  const questionSpacing = 40;

  const options = ["A", "B", "C", "D"];

  for (let q = 0; q < 50; q++) {
    const y = startY + q * questionSpacing;

    let darkest = 0;
    let chosen: string | null = null;

    for (let i = 0; i < options.length; i++) {
      const x = startX + i * optionSpacing;

      const darkness = measureDarkness(image, x, y, 40, 40);

      if (darkness > darkest) {
        darkest = darkness;
        chosen = options[i];
      }
    }

    if (darkest < 0.15) {
      chosen = null;
    }

    answers[q + 1] = chosen;
  }

  return NextResponse.json({ answers });
}
