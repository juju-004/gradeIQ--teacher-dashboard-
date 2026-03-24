export type AnswerOption = "-" | string;

export type AssessmentType = "omr" | "text";

export interface Answer {
  text: string;
  score: number;
}

export interface Question {
  questionNumber: number;
  type?: "list" | "keyword";
  answers: Answer[];
}

export interface GradedQuestion {
  score: number;
  maxScore: number;
}

export interface studentAnswers {
  questionNumber: number;
  answers: string[];
}

export type StudentOMRState = {
  file: File | null;
  answers?: AnswerOption[] | studentAnswers[]; // extracted or manually entered
};

export type Student = {
  id: string;
  name: string;
};
