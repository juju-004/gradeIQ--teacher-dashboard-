import {
  Answer,
  Question,
} from "@/app/(dashboard)/(teacher)/_types/assessments.types";

type GradeResult = {
  score: number;
  total: number;
  percentage: number;
  breakdown: {
    correct: boolean;
    expected: string;
    actual: string | null;
  }[];
};

export function gradeOMR(
  rubric: string[],
  answers: (string | null)[],
): GradeResult {
  const total = rubric.length;

  let score = 0;

  const breakdown = rubric.map((correctAnswer, index) => {
    const studentAnswer = answers[index] ?? "-";

    const correct = studentAnswer === correctAnswer;

    if (correct) score++;

    return {
      correct,
      expected: correctAnswer, // always string now
      actual: studentAnswer,
    };
  });

  const percentage = total === 0 ? 0 : (score / total) * 100;

  return {
    score,
    total,
    percentage,
    breakdown,
  };
}

export function gradeText(rubric: Question[], answers: Answer[]) {
  // total possible marks from rubric
  const total = rubric.reduce((sum, question) => {
    return (
      sum + question.answers.reduce((qSum, ans) => qSum + (ans.score ?? 0), 0)
    );
  }, 0);

  // student marks already computed per answer
  const score = answers.reduce((sum, ans) => sum + (ans.score ?? 0), 0);

  const percentage = total === 0 ? 0 : (score / total) * 100;

  return {
    score,
    total,
    percentage,
  };
}
