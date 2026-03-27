// import { gradeSentence } from "./gradeSentence";
import levenshtein from "fast-levenshtein";

export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

export function isFuzzyMatch(a: string, b: string, threshold = 0.8) {
  const distance = levenshtein.get(a, b);
  const maxLen = Math.max(a.length, b.length);

  const similarity = 1 - distance / maxLen;

  return similarity >= threshold;
}

export function fuzzyIncludes(
  sentence: string,
  keyword: string,
  threshold = 0.8,
) {
  const words = sentence.split(" ");
  const target = normalize(keyword);

  for (const word of words) {
    const dist = levenshtein.get(word, target);
    const maxLen = Math.max(word.length, target.length);
    const similarity = 1 - dist / maxLen;

    if (similarity >= threshold) return true;
  }

  return false;
}

export async function matchAnswer(student: string, rubric: string) {
  const s = normalize(student);
  const r = normalize(rubric);
  console.log(s, r);

  // ✅ 2. Fuzzy (word-level)
  if (isFuzzyMatch(s, r) || s === r) {
    return { matched: true };
  }

  // ✅ 3. Semantic (sentence-level)
  // const similarity = await gradeSentence(r, s);

  // if (similarity >= 0.75) {
  //   return { matched: true, confidence: similarity };
  // }

  return { matched: false };
}
