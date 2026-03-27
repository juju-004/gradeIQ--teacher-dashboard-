// AssessmentContext.tsx

"use client";

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
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
  const [mainResults, setMainResults] = useState<
    Record<string, StudentOMRState>
  >({});

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
