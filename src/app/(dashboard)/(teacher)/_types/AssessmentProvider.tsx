// AssessmentContext.tsx

"use client";

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

import {
  AssessmentType,
  AnswerOption,
  Question,
  Student,
  StudentOMRState,
} from "./assessments.types";

type AssessmentContextType = {
  // Page 1
  assessmentName: string;
  setAssessmentName: Dispatch<SetStateAction<string>>;

  questionCount: number;
  setQuestionCount: Dispatch<SetStateAction<number>>;

  optionCount: "3" | "4" | "5" | "6";
  setOptionCount: Dispatch<SetStateAction<"3" | "4" | "5" | "6">>;

  assessmentType: AssessmentType;
  setAssessmentType: Dispatch<SetStateAction<AssessmentType>>;

  // Page 2
  omrScheme: AnswerOption[];
  setOmrScheme: Dispatch<SetStateAction<AnswerOption[]>>;

  textQuestions: Question[];
  setTextQuestions: Dispatch<SetStateAction<Question[]>>;

  // students
  students: Student[] | null;
  setStudents: Dispatch<SetStateAction<Student[] | null>>;

  studentOMRMap: Record<string, StudentOMRState>;
  setStudentOMRMap: Dispatch<SetStateAction<Record<string, StudentOMRState>>>;

  results: Record<string, any[]>;
  setResults: Dispatch<SetStateAction<Record<string, any[]>>>;
};

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  // Page 1
  const [assessmentName, setAssessmentName] = useState("");

  const [questionCount, setQuestionCount] = useState(40);

  const [optionCount, setOptionCount] = useState<"3" | "4" | "5" | "6">("4");

  const [assessmentType, setAssessmentType] = useState<AssessmentType>("omr");

  // Page 2

  const [omrScheme, setOmrScheme] = useState<AnswerOption[]>([]);

  const [textQuestions, setTextQuestions] = useState<Question[]>([]);

  // students

  const [students, setStudents] = useState<Student[] | null>(null);

  const [studentOMRMap, setStudentOMRMap] = useState<
    Record<string, StudentOMRState>
  >({});
  const [results, setResults] = useState<Record<string, any[]>>({});

  return (
    <AssessmentContext.Provider
      value={{
        assessmentName,
        setAssessmentName,

        questionCount,
        setQuestionCount,

        optionCount,
        setOptionCount,

        assessmentType,
        setAssessmentType,

        omrScheme,
        setOmrScheme,

        textQuestions,
        setTextQuestions,

        students,
        setStudents,

        studentOMRMap,
        setStudentOMRMap,

        results,
        setResults,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);

  if (!ctx) {
    throw new Error("useAssessment must be used inside AssessmentProvider");
  }

  return ctx;
}
