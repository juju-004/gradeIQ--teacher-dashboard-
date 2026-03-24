"use client";

import { SetStateAction, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Question } from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RubricBuilder({
  questions,
  setQuestions,
}: {
  questions: Question[];
  setQuestions: (value: SetStateAction<Question[]>) => void;
}) {
  const addQuestion = () => {
    const newQuestion: Question = {
      questionNumber: questions.length++,
      type: "list",
      answers: [{ text: "", score: 1 }],
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.questionNumber !== id));
  };

  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.questionNumber === id ? { ...q, [field]: value } : q)),
    );
  };

  const updateAnswer = (
    questionId: number,
    index: number,
    field: "text" | "score",
    value: any,
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.questionNumber !== questionId) return q;

        const updated = [...q.answers];
        updated[index] = {
          ...updated[index],
          [field]: field === "score" ? Number(value) : value,
        };

        return { ...q, answers: updated };
      }),
    );
  };

  const addAnswer = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.questionNumber === questionId
          ? { ...q, answers: [...q.answers, { text: "", score: 1 }] }
          : q,
      ),
    );
  };

  const removeAnswer = (questionId: number, index: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.questionNumber !== questionId) return q;

        const updated = q.answers.filter((_, i) => i !== index);
        return { ...q, answers: updated };
      }),
    );
  };

  // ✅ TOTAL SCORE BOARD
  const totalScore = useMemo(() => {
    return questions.reduce((acc, q) => {
      const total = q.answers.reduce((sum, a) => sum + (a.score || 0), 0);

      return acc + total;
    }, 0);
  }, [questions]);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {questions.map((question, i) => (
          <motion.div
            key={question.questionNumber}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="px-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="fx gap-6">
                    <h3 className="font-semibold text-lg">Question {i + 1}</h3>
                    {question.answers.length > 1 && (
                      <Select
                        value={question.type}
                        onValueChange={(value: string) =>
                          updateQuestion(question.questionNumber, "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select options" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="list">List </SelectItem>
                          <SelectItem value="keyword">Keyword</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(question.questionNumber)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                {/* Answers */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    <span>
                      {question.type === "keyword"
                        ? "Keywords (each adds score)"
                        : "Acceptable Answers"}
                    </span>
                  </p>

                  <AnimatePresence>
                    {question.answers.map((answer, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex gap-2 items-center"
                      >
                        {/* TEXT */}
                        <Input
                          placeholder="Answer or keyword"
                          value={answer.text}
                          onChange={(e) =>
                            updateAnswer(
                              question.questionNumber,
                              index,
                              "text",
                              e.target.value,
                            )
                          }
                        />

                        {/* SCORE PER ANSWER */}
                        <Input
                          type="number"
                          className="w-20"
                          value={answer.score}
                          onChange={(e) =>
                            updateAnswer(
                              question.questionNumber,
                              index,
                              "score",
                              e.target.value,
                            )
                          }
                        />

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeAnswer(question.questionNumber, index)
                          }
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addAnswer(question.questionNumber)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Answer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Question */}
      <motion.div whileTap={{ scale: 0.96 }}>
        <Button onClick={addQuestion} className="w-full flex gap-2">
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </motion.div>

      {/* 🧮 TOTAL SCORE BOARD */}
      <Card className="border-2 border-primary">
        <CardContent className="p-6 flex justify-between items-center">
          <span className="text-lg font-semibold">Total Possible Score</span>
          <span className="text-2xl font-bold">{totalScore}</span>
        </CardContent>
      </Card>
    </div>
  );
}
