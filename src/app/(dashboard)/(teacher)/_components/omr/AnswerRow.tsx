import { AnswerOption } from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import { memo } from "react";
import { cn } from "@/lib/utils";

interface AnswerRowProps {
  questionNumber: number;
  value: AnswerOption;
  options: string[];
  onChange: (value: AnswerOption) => void;

  // NEW
  grading?: AnswerOption;
  // expected correct answer
}

export const AnswerRow = memo(function AnswerRow({
  questionNumber,
  value,
  options,
  onChange,
  grading,
}: AnswerRowProps) {
  const isCorrect = grading !== undefined && value === grading;
  const isWrong = grading !== undefined && value !== grading;

  return (
    <div className="flex items-center gap-2">
      <span className="w-7 text-sm font-medium">{questionNumber}.</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AnswerOption)}
        className={cn(
          `h-9 w-20 rounded-md border-2 px-2 pr-8 text-sm shadow-sm outline-none appearance-none transition bg-muted`,
          // grading states
          isCorrect && " ring-green-500 ring-2",
          isWrong && "ring-red-500 ring-2",
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 8 10 12 14 8' /%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.5rem center",
          backgroundSize: "1rem",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
});
