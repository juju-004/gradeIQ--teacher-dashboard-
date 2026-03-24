"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Question,
  studentAnswers,
} from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import {
  gradeAllQuestions,
  gradeSingleQuestion,
} from "@/app/(dashboard)/(teacher)/_grading/grade";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  rubric: Question[];
  initialStudentAnswers: studentAnswers[];
}

export default function GradingView({ rubric, initialStudentAnswers }: Props) {
  const [studentAnswers, setStudentAnswers] = useState<studentAnswers[]>(
    initialStudentAnswers,
  );

  const [results, setResults] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const resultMap = useMemo(
    () => new Map(results.map((r) => [r.questionNumber, r])),
    [results],
  );

  const studentMap = useMemo(
    () => new Map(studentAnswers.map((s) => [s.questionNumber, s])),
    [studentAnswers],
  );

  const totalPossibleScore = rubric.reduce((acc, q) => {
    const total = q.answers.reduce((sum, a) => sum + (a.score || 0), 0);

    return acc + total;
  }, 0);

  // ✅ Initial grading
  useEffect(() => {
    (async () => {
      const graded = await gradeAllQuestions(rubric, initialStudentAnswers);

      setResults(graded.results);
      setTotalScore(graded.totalScore);
    })();
  }, []);

  // ✏️ Update + incremental grading
  const updateAnswer = async (
    qNumber: number,
    index: number,
    value: string,
  ) => {
    const updatedAnswers: studentAnswers[] = studentAnswers.map((q) =>
      q.questionNumber === qNumber
        ? {
            ...q,
            answers: q.answers.map((a, i) => (i === index ? value : a)),
          }
        : q,
    );

    setStudentAnswers(updatedAnswers);

    // 🔥 grade only this question
    const updated = await gradeSingleQuestion(qNumber, rubric, updatedAnswers);

    setResults((prev) =>
      prev.map((r) => (r.questionNumber === qNumber ? updated : r)),
    );

    setTotalScore((prevTotal) => {
      const old = resultMap.get(qNumber);
      const oldScore = old?.score || 0;
      return prevTotal - oldScore + updated.score;
    });
  };

  const adjustScore = (qNumber: number, delta: number, maxScore: number) => {
    setResults((prev) =>
      prev.map((r) => {
        if (r.questionNumber !== qNumber) return r;

        const newScore = Math.min(
          maxScore,
          Math.max(0, (r.score || 0) + delta),
        );

        return {
          ...r,
          score: Number(newScore.toFixed(2)),
          manuallyAdjusted: true,
        };
      }),
    );

    setTotalScore((prevTotal) => {
      const old = resultMap.get(qNumber);
      const oldScore = old?.score || 0;

      const newScore = Math.min(maxScore, Math.max(0, oldScore + delta));

      return prevTotal - oldScore + newScore;
    });
  };

  const buttons = [
    { value: "-1" },
    { text: "+½", value: "0.5" },
    { value: "+1" },
  ];

  return (
    <div className="w-full max-w-xl space-y-6">
      {/* Questions */}
      {rubric.map((q) => {
        const student = studentMap.get(q.questionNumber);
        const result = resultMap.get(q.questionNumber);

        const maxScore = q.answers.reduce((sum, a) => sum + a.score, 0);

        return (
          <div key={q.questionNumber} className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                Question {q.questionNumber}
              </h4>

              <div className="flex items-center gap-2">
                {/* score badge */}
                <span className="text-xs px-2 py-1 rounded-md bg-c1 font-medium">
                  {result?.score || 0} / {maxScore}
                </span>

                {/* controls */}
                <div className="flex items-center gap-1">
                  {buttons.map((b, i) => (
                    <button
                      onClick={() =>
                        adjustScore(
                          q.questionNumber,
                          parseFloat(b.value),
                          maxScore,
                        )
                      }
                      className="text-xs px-2 py-1 rounded-md border bg-muted active:scale-75 transition"
                    >
                      {b.text || b.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Answers */}
            <div className="space-y-2">
              {student?.answers.map((ans, i) => {
                const detail = result?.details?.[i];
                const isCorrect = detail?.correct || detail?.matched;

                return (
                  <div key={i} className="space-y-1">
                    <Input
                      value={ans}
                      onChange={(e) =>
                        updateAnswer(q.questionNumber, i, e.target.value)
                      }
                      className={cn(
                        "h-9 text-sm",
                        isCorrect &&
                          "border-green-500 focus-visible:ring-green-500",
                        !isCorrect &&
                          ans &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                    />

                    {/* feedback */}
                    {ans && (
                      <span
                        className={cn(
                          "text-xs",
                          isCorrect ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Keyword chips */}
            {q.type === "keyword" && result?.details && (
              <div className="flex flex-wrap gap-2 pt-1">
                {result.details.map((k: any, i: number) => (
                  <span
                    key={i}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-md border",
                      k.matched
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "text-muted-foreground",
                    )}
                  >
                    {k.keyword}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="border-t pt-2" />
          </div>
        );
      })}

      <Card className="border-2 border-primary">
        <CardContent className="px-6 py-3 flex justify-between items-center">
          <span className="text-base font-semibold">Total Score</span>
          <span className="text-xl font-bold">
            {totalScore}/{totalPossibleScore}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
