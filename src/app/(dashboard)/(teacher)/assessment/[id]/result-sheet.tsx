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
import { cn } from "@/lib/utils";

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
  const isOMR = type === "omr";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle className="pt-3">
              {name}

              <div className="flex gap-2 mt-3 flex-wrap">
                <Badge className="bg-c1 text-white">
                  {score}/{totalScore}
                </Badge>

                <Badge variant="secondary">
                  <span className="opacity-50 font-light">Percentage:</span>{" "}
                  {percentage}%
                </Badge>

                {isOMR && (
                  <Badge variant="secondary">
                    <span className="opacity-50 font-light">Unattempted:</span>{" "}
                    {omrStats?.unattempted}
                  </Badge>
                )}
              </div>
              {isOMR && (
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
              )}
            </SheetTitle>

            <Separator className="my-4" />

            <SheetDescription asChild>
              <div className=" py-2">
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
                            className="flex items-center justify-between border rounded-xl px-3"
                          >
                            <div className="space-y-1 flex justify-between gap-3">
                              <p className="font-medium">Q{idx + 1}</p>

                              <div className="text-sm flex gap-4">
                                <span>
                                  <span className="">Correct:</span>{" "}
                                  <strong className="text-c1">
                                    {correctAnswer}
                                  </strong>
                                </span>

                                <span>
                                  <span className="">Student:</span>{" "}
                                  <strong
                                    className={cn(
                                      studentAnswer === "-"
                                        ? "text-muted-foreground"
                                        : correct
                                          ? "text-green-600"
                                          : "text-red-600",
                                    )}
                                  >
                                    {studentAnswer}
                                  </strong>
                                </span>
                              </div>
                            </div>
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
                            <div
                              className={cn(
                                "bg-muted p-2 rounded-md",
                                question.type === "list" &&
                                  "flex flex-col gap-1 list-disc",
                              )}
                            >
                              {question.type === "list"
                                ? studentAnswer?.text
                                    .split(",")
                                    .map((txt, key) => (
                                      <span key={key}>{txt}</span>
                                    ))
                                : studentAnswer?.text || "-"}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Expected{" "}
                            {question.type === "keyword"
                              ? "keywords"
                              : "answers"}
                            :
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
