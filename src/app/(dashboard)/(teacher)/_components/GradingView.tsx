"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";

import { CheckCircle2, XCircle, Minus, Trash2, Plus } from "lucide-react";
import { useAssessment } from "@/app/(dashboard)/(teacher)/_types/AssessmentProvider";

interface Props {
  rubric: Question[];
  activeStudentId: string;
}

export default function GradingView({ rubric, activeStudentId }: Props) {
  const { studentOMRMap, setStudentOMRMap } = useAssessment();
  const [results, setResults] = useState<any[]>([]);

  const studentAnswers = useMemo(
    () =>
      activeStudentId && studentOMRMap[activeStudentId]
        ? (studentOMRMap[activeStudentId].answers as studentAnswers[])
        : [],
    [studentOMRMap, activeStudentId],
  );
  const resultMap = useMemo(
    () => new Map(results.map((r) => [r.questionNumber, r])),
    [results],
  );
  const rubricMap = useMemo(
    () => new Map(rubric.map((q) => [q.questionNumber, q])),
    [rubric],
  );
  const totalScore = useMemo(() => {
    let total = 0;

    for (const r of resultMap.values()) {
      total += r.score || 0;
    }

    return Number(total.toFixed(2));
  }, [resultMap]);
  const usedQuestionNumbers = useMemo(
    () => studentAnswers.map((s) => s.questionNumber),
    [studentAnswers],
  );
  const totalPossibleScore = rubric.reduce((acc, q) => {
    const total = q.answers.reduce((sum, a) => sum + (a.score || 0), 0);
    return acc + total;
  }, 0);

  useEffect(() => {
    (async () => {
      const graded = await gradeAllQuestions(rubric, studentAnswers);
      setResults(graded.results);
    })();
  }, []);

  const debouncedGrade = useDebouncedCallback(
    async (qNumber: number, updatedAnswers: studentAnswers[]) => {
      const updated = await gradeSingleQuestion(
        qNumber,
        rubric,
        updatedAnswers,
      );

      setResults((prev) =>
        prev.map((r) => (r.questionNumber === qNumber ? updated : r)),
      );
    },
    1000, // delay in ms
  );
  const setStudentAnswers = (answers: studentAnswers[]) => {
    setStudentOMRMap((prev) => ({
      ...prev,
      [activeStudentId]: {
        ...prev[activeStudentId],
        answers,
      },
    }));
  };
  const updateAnswer = async (
    qNumber: number,
    index: number,
    value: string,
  ) => {
    const updatedAnswers = studentAnswers.map((q) =>
      q.questionNumber === qNumber
        ? {
            ...q,
            answers: q.answers.map((a, i) => (i === index ? value : a)),
          }
        : q,
    );

    setStudentAnswers(updatedAnswers);
    debouncedGrade(qNumber, updatedAnswers);
  };

  const updateQuestionNumber = async (oldNumber: number, newNumber: number) => {
    if (!newNumber) return;

    const updatedAnswers = studentAnswers.map((q) =>
      q.questionNumber === oldNumber ? { ...q, questionNumber: newNumber } : q,
    );

    setStudentAnswers(updatedAnswers);

    const updated = await gradeSingleQuestion(
      newNumber,
      rubric,
      updatedAnswers,
    );

    setResults((prev) => {
      const filtered = prev.filter((r) => r.questionNumber !== oldNumber);
      return [...filtered, updated];
    });
  };

  const deleteAnswer = async (qNumber: number, index: number) => {
    const updatedAnswers = studentAnswers.map((q) =>
      q.questionNumber === qNumber
        ? {
            ...q,
            answers: q.answers.filter((_, i) => i !== index),
          }
        : q,
    );

    setStudentAnswers(updatedAnswers);

    const updated = await gradeSingleQuestion(qNumber, rubric, updatedAnswers);

    setResults((prev) =>
      prev.map((r) => (r.questionNumber === qNumber ? updated : r)),
    );
  };

  const addAnswer = (qNumber: number) => {
    if (!activeStudentId) return; // safeguard

    const currentAnswers = studentAnswers; // already memoized
    const updatedAnswers = currentAnswers.map((q) =>
      q.questionNumber === qNumber
        ? { ...q, answers: [...q.answers, ""] } // add new blank answer
        : q,
    );

    setStudentAnswers(updatedAnswers);
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
  };

  const toggleListAnswer = (
    qNumber: number,
    index: number,
    maxScore: number,
  ) => {
    setResults((prev) =>
      prev.map((r) => {
        if (r.questionNumber !== qNumber) return r;

        const detail = r.details?.[index];
        if (!detail) return r;

        const wasCorrect = detail.correct ?? detail.matched ?? false;

        const rubricQuestion = rubric.find((q) => q.questionNumber === qNumber);

        const answerScore = rubricQuestion?.answers[index]?.score || 0;

        const delta = wasCorrect ? -answerScore : answerScore;

        const newScore = Math.min(
          maxScore,
          Math.max(0, (r.score || 0) + delta),
        );

        const newDetails = [...r.details];

        newDetails[index] = {
          ...detail,
          correct: !wasCorrect,
          manuallyAdjusted: true,
        };

        return {
          ...r,
          score: Number(newScore.toFixed(2)),
          details: newDetails,
        };
      }),
    );
  };

  const addQuestionBlock = () => {
    if (!activeStudentId) return;

    const unusedNumbers = rubric
      .map((q) => q.questionNumber)
      .filter((n) => !usedQuestionNumbers.includes(n));

    if (!unusedNumbers.length) return;

    const newQNumber = unusedNumbers[0];

    const rubricQ = rubric.find((q) => q.questionNumber === newQNumber);

    const newBlock: studentAnswers = {
      questionNumber: newQNumber,
      answers: rubricQ?.type === "list" ? [""] : [""],
    };

    setStudentAnswers([...studentAnswers, newBlock]);
  };

  const deleteQuestionBlock = async (qNumber: number) => {
    const updatedAnswers = studentAnswers.filter(
      (q) => q.questionNumber !== qNumber,
    );

    setStudentAnswers(updatedAnswers);

    setResults((prev) => prev.filter((r) => r.questionNumber !== qNumber));
  };

  const buttons = [
    { value: "-1" },
    { text: "+½", value: "0.5" },
    { value: "+1" },
  ];

  return (
    <motion.div layout className="w-full max-w-xl space-y-6">
      <AnimatePresence>
        {studentAnswers.map((studentQ) => {
          const qNumber = studentQ.questionNumber;
          const rubricQ = rubricMap.get(qNumber);
          const result = resultMap.get(qNumber);

          const maxScore =
            rubricQ?.answers.reduce((sum, a) => sum + a.score, 0) || 0;

          const availableNumbers = rubric
            .map((q) => q.questionNumber)
            .filter((n) => !usedQuestionNumbers.includes(n) || n === qNumber);

          return (
            <motion.div
              key={qNumber}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* header */}

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteQuestionBlock(qNumber)}>
                    <Trash2 className="w-4 h-4 text-muted-foreground duration-150 hover:text-red-500" />
                  </button>
                  <span className="text-lg font-semibold ">Question</span>
                  <Select
                    value={String(qNumber)}
                    onValueChange={(v) =>
                      updateQuestionNumber(qNumber, Number(v))
                    }
                  >
                    <SelectTrigger className="w-24 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {availableNumbers.map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <motion.div layout className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-c1 font-medium">
                    {result?.score || 0} / {maxScore}
                  </span>

                  <div className="flex gap-1 bg-muted rounded-md">
                    {buttons.map((b, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          adjustScore(qNumber, parseFloat(b.value), maxScore)
                        }
                        className="text-xs hover:bg-background px-2 py-1 border rounded-md"
                      >
                        {b.text || b.value}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* answers */}

              <div className="space-y-2">
                <AnimatePresence>
                  {studentQ.answers.map((ans, i) => {
                    const detail = result?.details?.[i];

                    const isCorrect = detail?.correct ?? detail?.matched;

                    return (
                      <motion.div
                        key={i}
                        layout
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex gap-2 items-center"
                      >
                        <Input
                          value={ans}
                          onChange={(e) =>
                            updateAnswer(qNumber, i, e.target.value)
                          }
                          className={cn(
                            isCorrect && "border-green-500",
                            !isCorrect && ans && "border-red-500",
                          )}
                        />

                        {rubricQ?.type === "list" && ans && (
                          <button
                            onClick={() =>
                              toggleListAnswer(qNumber, i, maxScore)
                            }
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </button>
                        )}

                        <button onClick={() => deleteAnswer(qNumber, i)}>
                          <Minus className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addAnswer(qNumber)}
                  className="mt-2 flex gap-1"
                >
                  <Plus className="w-4 h-4" />
                  add answer
                </Button>
              </div>

              {rubricQ?.type === "keyword" && result?.details && (
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
              <div className="border-t pt-2" />
            </motion.div>
          );
        })}
      </AnimatePresence>
      <Button
        variant="secondary"
        onClick={addQuestionBlock}
        className="w-full flex gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Answer block
      </Button>

      {/* total */}

      <motion.div layout>
        <Card className="border-2 border-primary">
          <CardContent className="px-6 py-3 flex justify-between">
            <span className="font-semibold">Total Score</span>

            <span className="text-xl font-bold">
              {totalScore}/{totalPossibleScore}
            </span>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
