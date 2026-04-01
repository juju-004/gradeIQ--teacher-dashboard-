import { SetStateAction, useCallback, useEffect } from "react";
import { AnswerRow } from "./AnswerRow";
import { AnswerOption } from "@/app/(dashboard)/(teacher)/_types/assessments.types";

interface AnswerKeyProps {
  answers: AnswerOption[];
  setAnswers: (
    value: SetStateAction<AnswerOption[]>,
    studentId: string,
  ) => void;
  gradingRubric?: AnswerOption[];
  startFrom?: number;
  optionCount: number;
  studentId: string;
}

export function AnswerKeySelect({
  startFrom = 1,
  answers,
  setAnswers,
  optionCount = 4,
  gradingRubric,
  studentId,
}: AnswerKeyProps) {
  const options = [
    "-",
    ...Array.from(
      { length: optionCount },
      (_, i) => String.fromCharCode(65 + i), // A, B, C...
    ),
  ];

  const updateAnswer = useCallback(
    (index: number, value: AnswerOption) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      }, studentId);
    },
    [studentId, setAnswers],
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {answers.map((value, index) => {
        const correctAnswer = gradingRubric?.[index];

        return (
          <AnswerRow
            key={index}
            options={options}
            questionNumber={startFrom + index}
            value={value}
            grading={correctAnswer} // 🔥 passed down here
            onChange={(v) => updateAnswer(index, v)}
          />
        );
      })}
    </div>
  );
}
