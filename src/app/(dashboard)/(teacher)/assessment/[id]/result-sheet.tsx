"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  CheckCircle2,
  Grid2X2,
  LayoutList,
  MinusCircle,
  XCircle,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
  AnswerOption,
  Question,
  Answer,
  AssessmentType,
} from "@/app/(dashboard)/(teacher)/_types/assessments.types";

export interface ResultSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  close: () => void;

  name: string;
  score: string;
  totalScore: string;
  percentage: string;

  type: AssessmentType;

  rubric: AnswerOption[] | Question[];
  answers: string[] | Answer[];
}

export default function ResultSheet({
  open,
  onOpenChange,
  close,

  name,
  score,
  totalScore,
  percentage,

  type,
  rubric,
  answers,
}: ResultSheetProps) {
  const [view, setView] = useState<"detailed" | "compact">("compact");

  /*
    TYPE GUARDS
  */

  const isOMR = type === "omr";

  /*
    OMR CALCULATIONS
  */

  const omrStats = useMemo(() => {
    if (!isOMR) return null;

    const scheme = rubric as AnswerOption[];
    const studentAnswers = answers as AnswerOption[];

    const total = scheme.length;

    const correct = scheme.filter((correctAnswer, idx) => {
      const studentAnswer = studentAnswers[idx];
      return studentAnswer !== "-" && studentAnswer === correctAnswer;
    }).length;

    const unattempted = studentAnswers.filter((a) => a === "-").length;

    return {
      total,
      correct,
      unattempted,
    };
  }, [isOMR, rubric, answers]);

  /*
    TEXT CALCULATIONS
  */

  const textBreakdown = useMemo(() => {
    if (isOMR) return null;

    const questions = rubric as Question[];
    const studentAnswers = answers as Answer[];

    return questions.map((q) => {
      const studentAnswer = studentAnswers.find((a) => a.text?.trim() !== "");

      const totalScore = q.answers.reduce((sum, a) => sum + a.score, 0);

      return {
        questionNumber: q.questionNumber,
        rubricAnswers: q.answers,
        totalScore,
      };
    });
  }, [isOMR, rubric, answers]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle>
              {name}

              <div className="flex gap-2 mt-3 flex-wrap">
                <Badge className="bg-c1 text-white">
                  {score}/{totalScore}
                </Badge>

                <Badge variant="secondary">{percentage}%</Badge>

                {isOMR && (
                  <Badge variant="outline">
                    {omrStats?.unattempted} Unattempted
                  </Badge>
                )}
              </div>

              {/* VIEW TOGGLE */}

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setView("detailed")}
                  className={`p-2 rounded-md border transition ${
                    view === "detailed"
                      ? "bg-c1 text-white border-c1"
                      : "hover:bg-muted"
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setView("compact")}
                  className={`p-2 rounded-md border transition ${
                    view === "compact"
                      ? "bg-c1 text-white border-c1"
                      : "hover:bg-muted"
                  }`}
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
              </div>
            </SheetTitle>

            <Separator className="my-4" />

            <SheetDescription asChild>
              <div className="px-6 py-2">
                {/* ================= OMR ================= */}

                {isOMR &&
                  (view === "detailed" ? (
                    <div className="space-y-3">
                      {(rubric as AnswerOption[]).map((correctAnswer, idx) => {
                        const studentAnswer = (answers as AnswerOption[])[idx];

                        const correct =
                          studentAnswer !== "-" &&
                          studentAnswer === correctAnswer;

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between border rounded-xl p-3"
                          >
                            <div className="space-y-1">
                              <p className="font-medium">Question {idx + 1}</p>

                              <div className="text-sm flex gap-4">
                                <span>
                                  <span className="text-muted-foreground">
                                    Correct:
                                  </span>{" "}
                                  <strong>{correctAnswer}</strong>
                                </span>

                                <span>
                                  <span className="text-muted-foreground">
                                    Student:
                                  </span>{" "}
                                  <strong>{studentAnswer}</strong>
                                </span>
                              </div>
                            </div>

                            {studentAnswer === "-" ? (
                              <MinusCircle className="text-muted-foreground" />
                            ) : correct ? (
                              <CheckCircle2 className="text-green-600" />
                            ) : (
                              <XCircle className="text-red-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {(rubric as AnswerOption[]).map((correctAnswer, idx) => {
                        const studentAnswer = (answers as AnswerOption[])[idx];

                        const correct =
                          studentAnswer !== "-" &&
                          studentAnswer === correctAnswer;

                        return (
                          <div
                            key={idx}
                            className={`rounded-lg border p-2 flex flex-col items-center text-sm font-medium
                                ${
                                  studentAnswer === "-"
                                    ? "text-muted-foreground"
                                    : correct
                                      ? "border-green-500 text-green-600"
                                      : "border-red-500 text-red-600"
                                }`}
                          >
                            <span>Q{idx + 1}</span>

                            <span>{studentAnswer}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                {/* ================= TEXT ================= */}

                {!isOMR && (
                  <div className="space-y-4">
                    {(rubric as Question[]).map((question, index) => {
                      const studentAnswer = (answers as Answer[])[index];

                      const scoreEarned = studentAnswer?.score ?? 0;

                      const maxScore = question.answers.reduce(
                        (sum, a) => sum + a.score,
                        0,
                      );

                      return (
                        <div
                          key={index}
                          className="border rounded-xl p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              Question {question.questionNumber}
                            </p>

                            <Badge
                              variant={
                                scoreEarned === maxScore
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {scoreEarned}/{maxScore}
                            </Badge>
                          </div>

                          <div className="text-sm">
                            <p className="text-muted-foreground mb-1">
                              Student answer
                            </p>

                            <div className="bg-muted p-2 rounded-md">
                              {studentAnswer?.text || "-"}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Expected keywords / answers:
                            <div className="flex flex-wrap gap-1 mt-1">
                              {question.answers.map((ans, i) => (
                                <Badge key={i} variant="outline">
                                  {ans.text}({ans.score})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </SheetDescription>

            <Separator className="my-4" />

            <SheetFooter>
              <div className="text-xs text-muted-foreground">
                Automatically graded by <span className="text-c1">GradeIQ</span>
              </div>
            </SheetFooter>
          </SheetHeader>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
