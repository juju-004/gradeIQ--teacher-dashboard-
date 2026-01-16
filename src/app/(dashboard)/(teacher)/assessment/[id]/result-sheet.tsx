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
import { AnswerOption } from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Grid2X2,
  LayoutList,
  MinusCircle,
  XCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export interface IResultSheet {
  close: () => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  studentName: string;
  markingScheme: AnswerOption[];
  answers: AnswerOption[];
}

export default function ResultSheet({
  open,
  onOpenChange,
  close,
  studentName,
  markingScheme,
  answers,
}: IResultSheet) {
  const [view, setView] = useState<"detailed" | "compact">("compact");

  const total = markingScheme.length;

  const correct = markingScheme.filter((correctAnswer, idx) => {
    const studentAnswer = answers[idx];
    return studentAnswer !== "-" && studentAnswer === correctAnswer;
  }).length;

  const unattempted = answers.filter((a) => a === "-").length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle className="mb-4">
              {studentName}{" "}
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge className="bg-c1 text-white">
                  {correct}/{total} Correct
                </Badge>
                <Badge variant="secondary">
                  {Math.round((correct / total) * 100)}%
                </Badge>
                <Badge variant="outline">
                  {unattempted} <span className="opacity-75">Unattempted</span>
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setView("detailed")}
                  className={`p-2 rounded-md border transition ${
                    view === "detailed"
                      ? "bg-c1 text-white border-c1"
                      : "hover:bg-muted"
                  }`}
                  title="Detailed view"
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
                  title="Compact view"
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
              </div>
            </SheetTitle>
            <Separator className="" />

            <SheetDescription asChild>
              <div className="px-6 py-4">
                {view === "detailed" ? (
                  <div className="space-y-4">
                    {markingScheme.map((correctAnswer, idx) => {
                      const studentAnswer = answers[idx];
                      const isCorrect =
                        studentAnswer !== "-" &&
                        studentAnswer === correctAnswer;

                      return (
                        <div
                          key={idx}
                          className="rounded-xl border p-2 flex items-center justify-between"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-white">
                              Question {idx + 1}
                            </p>

                            <div className="flex gap-4 text-sm">
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
                          ) : isCorrect ? (
                            <CheckCircle2 className="text-green-600" />
                          ) : (
                            <XCircle className="text-red-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Compact View */
                  <div className="grid grid-cols-4 w-full sm:grid-cols-5 gap-3">
                    {markingScheme.map((correctAnswer, idx) => {
                      const studentAnswer = answers[idx];
                      const isCorrect =
                        studentAnswer !== "-" &&
                        studentAnswer === correctAnswer;

                      return (
                        <div
                          key={idx}
                          className={`rounded-lg border p-2 flex flex-col items-center justify-center text-sm font-medium ${
                            studentAnswer === "-"
                              ? "text-muted-foreground"
                              : isCorrect
                              ? "border-green-500 text-green-600"
                              : "border-red-500 text-red-600"
                          }`}
                          title={`Q${
                            idx + 1
                          } — Correct: ${correctAnswer}, Student: ${studentAnswer}`}
                        >
                          <span>Q{idx + 1}</span>
                          <span>{studentAnswer}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </SheetDescription>
            <Separator className="my-4" />
            <SheetFooter>
              <div className="px-6 text-xs text-muted-foreground">
                Automatically graded by <span className="text-c1">GradeIQ</span>
              </div>
            </SheetFooter>
          </SheetHeader>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
