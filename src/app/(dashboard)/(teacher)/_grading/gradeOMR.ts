import { Answer } from "@/app/(dashboard)/(teacher)/_types/assessments.types";

export function gradeOMR(rubric: string[], answers: (string | null)[]) {
  let score = 0;

  rubric.map((correctAnswer, index) => {
    const studentAnswer = answers[index] ?? "-";
    const correct = studentAnswer === correctAnswer;

    if (correct) score++;
  });

  return score;
}

export function gradeText(answers: Answer[]) {
  // student marks already computed per answer
  const score = answers.reduce((sum, ans) => sum + (ans.score ?? 0), 0);
  return score;
}
