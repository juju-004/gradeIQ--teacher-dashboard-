/**
 * Grades a student's answers against the answer key.
 *
 * @param answerKey - The correct answers (['A','B','C',...])
 * @param studentAnswers - The student's answers (['A','-','C',...])
 * @returns { score, percentage }
 */
export function gradeAnswers(
  answerKey: string[],
  studentAnswers: string[]
): { score: number; percentage: number } {
  // Safety: make sure both arrays exist
  if (!Array.isArray(answerKey) || !Array.isArray(studentAnswers)) {
    return { score: 0, percentage: 0 };
  }

  const totalQuestions = answerKey.length;
  let score = 0;

  for (let i = 0; i < totalQuestions; i++) {
    // Count correct answers only
    if (studentAnswers[i] === answerKey[i]) {
      score++;
    }
  }

  const percentage =
    totalQuestions === 0
      ? 0
      : Number(((score / totalQuestions) * 100).toFixed(2));

  return { score, percentage };
}
