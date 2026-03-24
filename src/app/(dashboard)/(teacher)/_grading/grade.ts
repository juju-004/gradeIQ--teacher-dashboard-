import {
  fuzzyIncludes,
  isFuzzyMatch,
  matchAnswer,
  normalize,
} from "@/app/(dashboard)/(teacher)/_grading/utils";
import {
  Answer,
  Question,
  studentAnswers,
} from "@/app/(dashboard)/(teacher)/_types/assessments.types";

export async function gradeListQuestion(
  rubric: { text: string; score: number }[],
  studentAnswers: string[],
) {
  const usedRubric = new Set<number>();
  let totalScore = 0;

  const results: {
    answer: string;
    correct: boolean;
    score: number;
    matched?: string;
  }[] = [];

  for (const studentAnswer of studentAnswers) {
    let bestIndex = -1;

    for (let i = 0; i < rubric.length; i++) {
      if (usedRubric.has(i)) continue;

      const { matched } = await matchAnswer(studentAnswer, rubric[i].text);

      if (matched) {
        bestIndex = i;
      }
    }

    if (bestIndex !== -1) {
      const matched = rubric[bestIndex];

      usedRubric.add(bestIndex);
      totalScore += matched.score;

      results.push({
        answer: studentAnswer,
        correct: true,
        score: matched.score,
        matched: matched.text,
      });
    } else {
      results.push({
        answer: studentAnswer,
        correct: false,
        score: 0,
      });
    }
  }

  return {
    totalScore,
    results,
  };
}

export async function gradeKeywordQuestion(
  rubric: Answer[],
  studentAnswer: string,
) {
  const normalizedSentence = normalize(studentAnswer);

  let totalScore = 0;

  const results: {
    keyword: string;
    matched: boolean;
    score: number;
  }[] = [];

  for (const item of rubric) {
    const keyword = normalize(item.text);

    let matched = false;

    // ✅ 1. Exact match (fastest)
    if (normalizedSentence.includes(keyword)) {
      matched = true;
    }

    // ✅ 2. Fuzzy match (word-level)
    else if (fuzzyIncludes(normalizedSentence, keyword)) {
      matched = true;
    }

    if (matched) {
      totalScore += item.score;
    }

    results.push({
      keyword: item.text,
      matched,
      score: matched ? item.score : 0,
    });
  }

  return {
    totalScore,
    results,
  };
}

export function gradeDirectQuestion(rubric: string, studentAnswer: string) {
  const s = normalize(studentAnswer);
  const r = normalize(rubric);

  if (s === r) return { matched: true };
  if (isFuzzyMatch(s, r)) return { matched: true };

  return { matched: false };
}

export async function gradeAllQuestions(
  rubricQuestions: Question[],
  studentAnswersList: studentAnswers[],
) {
  const results = [];
  let totalScore = 0;

  // 🔥 Map student answers by question number for fast lookup
  const studentMap = new Map<number, studentAnswers>();

  for (const s of studentAnswersList) {
    studentMap.set(s.questionNumber, s);
  }

  for (const rubric of rubricQuestions) {
    const student = studentMap.get(rubric.questionNumber);

    let questionResult: any = {
      questionNumber: rubric.questionNumber,
      type: rubric.type,
      score: 0,
      maxScore: rubric.answers.reduce((sum, a) => sum + a.score, 0),
      details: null,
    };

    // ❌ No answer provided
    if (!student) {
      results.push(questionResult);
      continue;
    }

    // ✅ LIST TYPE (MCQ / short answers)
    if (rubric.type === "list") {
      const graded = await gradeListQuestion(rubric.answers, student.answers);

      questionResult.score = graded.totalScore;
      questionResult.details = graded.results;
    }

    // ✅ KEYWORD TYPE (theory / long answers)
    else if (rubric.type === "keyword") {
      const graded = await gradeKeywordQuestion(
        rubric.answers,
        student.answers.join(" "), // combine into sentence
      );

      questionResult.score = graded.totalScore;
      questionResult.details = graded.results;
    }

    // ✅ DIRECT TYPE (true/false, exact values)
    else if (rubric.type === "direct") {
      const studentAnswer = student.answers[0] || "";

      const graded = gradeDirectQuestion(
        rubric.answers[0]?.text || "",
        studentAnswer,
      );

      questionResult.score = graded.matched ? rubric.answers[0]?.score || 1 : 0;

      questionResult.details = graded;
    }

    totalScore += questionResult.score;
    results.push(questionResult);
  }

  return {
    totalScore,
    results,
  };
}

export async function gradeSingleQuestion(
  questionNumber: number,
  rubricQuestions: Question[],
  studentAnswersList: studentAnswers[],
) {
  // 🔍 Find the rubric for this question
  const rubric = rubricQuestions.find(
    (q) => q.questionNumber === questionNumber,
  );

  if (!rubric) {
    throw new Error(`Rubric for question ${questionNumber} not found`);
  }

  // 🔍 Find the student's answer
  const student = studentAnswersList.find(
    (s) => s.questionNumber === questionNumber,
  );

  let result: any = {
    questionNumber: rubric.questionNumber,
    type: rubric.type,
    score: 0,
    maxScore: rubric.answers.reduce((sum, a) => sum + a.score, 0),
  };

  // ❌ No answer provided
  if (!student) {
    return result;
  }

  // ✅ LIST TYPE
  if (rubric.type === "list") {
    const graded = await gradeListQuestion(rubric.answers, student.answers);

    result.score = graded.totalScore;
    result.details = graded.results;
  }

  // ✅ KEYWORD TYPE
  else if (rubric.type === "keyword") {
    const graded = await gradeKeywordQuestion(
      rubric.answers,
      student.answers.join(" "),
    );

    result.score = graded.totalScore;
    result.details = graded.results;
  }

  // ✅ DIRECT TYPE
  else if (rubric.type === "direct") {
    const studentAnswer = student.answers[0] || "";

    const graded = gradeDirectQuestion(
      rubric.answers[0]?.text || "",
      studentAnswer,
    );

    result.score = graded.matched ? rubric.answers[0]?.score || 1 : 0;

    result.details = graded;
  }

  return result;
}
