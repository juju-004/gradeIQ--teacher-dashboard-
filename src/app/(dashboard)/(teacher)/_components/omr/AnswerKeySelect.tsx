import { useEffect, useCallback, SetStateAction } from "react";
import { AnswerRow } from "./AnswerRow";
import { AnswerOption } from "@/app/(dashboard)/(teacher)/_types/assessments.types";

interface AnswerKeyProps {
  numberOfQuestions: number;
  answers: AnswerOption[];
  setAnswers: (value: SetStateAction<AnswerOption[]>) => void;
  startFrom?: number;
  optionCount: number;
}

export function AnswerKeySelect({
  numberOfQuestions,
  startFrom = 1,
  answers,
  setAnswers,
  optionCount = 4,
}: AnswerKeyProps) {
  const options = [
    "-",
    ...Array.from(
      { length: optionCount },
      (_, i) => String.fromCharCode(65 + i) // A, B, C...
    ),
  ];

  /** Initialize / resize */
  useEffect(() => {
    setAnswers((prev) => {
      const next = [...prev];

      for (let i = 0; i < numberOfQuestions; i++) {
        // Reset invalid answers when optionCount changes
        if (!options.includes(prev[i])) {
          next[i] = options[0];
        } else {
          next[i] = prev[i];
        }
      }

      return next.slice(0, numberOfQuestions);
    });
  }, [numberOfQuestions, optionCount]);

  const updateAnswer = useCallback((index: number, value: AnswerOption) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {answers.map((value, index) => (
        <AnswerRow
          key={index}
          options={options}
          questionNumber={startFrom + index}
          value={value}
          onChange={(v) => updateAnswer(index, v)}
        />
      ))}
    </div>
  );
}
