"use client";

import { AnswerKeySelect } from "@/app/(dashboard)/(teacher)/_components/omr/AnswerKeySelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { AnimatePresence } from "framer-motion";
import {
  AnswerOption,
  Question,
} from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import RubricBuilder from "@/app/(dashboard)/(teacher)/_components/RubricBuilder";
import { toast } from "sonner";
import Fadein from "@/components/ui/fadein";
import { useAssessment } from "@/app/(dashboard)/(teacher)/_types/AssessmentProvider";
import axios from "axios";

type RubricTextProps = {
  value: Question[];
  onChange: Dispatch<SetStateAction<Question[]>>;
};
type RubricOMRProps = {
  value: AnswerOption[];
  onChange: Dispatch<SetStateAction<AnswerOption[]>>;
};

export default function Rubric() {
  const {
    assessmentType,
    questionCount,
    optionCount,
    omrScheme,
    textQuestions,
    setOmrScheme,
    setTextQuestions,
  } = useAssessment();

  const rubric: { omr: RubricOMRProps; text: RubricTextProps } = {
    omr: { value: omrScheme, onChange: setOmrScheme },
    text: { value: textQuestions, onChange: setTextQuestions },
  };

  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (assessmentType === "omr") return;
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    startTransition(async () => {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("mode", "rubric");

      try {
        const { data } = await axios.post("/api/ocr", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        rubric["text"].onChange(data);

        setFile(selectedFile);
      } catch (err) {
        console.error(err);
        toast.error("Upload failed");
      }
    });
  };

  useEffect(() => {
    if (assessmentType === "omr" && !rubric["omr"].value.length)
      rubric["omr"].onChange(Array(questionCount).fill("-"));
  }, [assessmentType]);

  useEffect(() => {
    setOmrScheme((prev) => {
      const next = [...prev];

      if (next.length < questionCount) {
        next.push(...Array(questionCount - next.length).fill("-"));
      } else {
        next.length = questionCount;
      }

      return next;
    });
  }, [questionCount]);

  return (
    <section className="space-y-4 mx-auto max-w-xl">
      <div className="space-y-4">
        {/* File Upload */}
        {assessmentType === "text" ? (
          <>
            <div className="space-y-1 gap-3">
              <Label className="text-lg font-semibold">
                Upload Rubric Image
              </Label>
              <p className="text-sm text-muted-foreground">
                Please upload a clear image or images of the correct answers
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: JPG, PNG, JPEG. Max 5MB.
              </p>
              <label className="mt-6">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={uploadFile}
                />
                <Button
                  type="button"
                  className="bg-c1 mt-6 text-white -translate-x-2 rounded-full hover:bg-c1/90 cursor-pointer"
                  onClick={() => inputRef.current?.click()}
                >
                  {isPending
                    ? "Analyzing..."
                    : file
                      ? "Add more files"
                      : "Choose File"}
                </Button>
              </label>
            </div>
          </>
        ) : rubric["omr"].value.length ? (
          <Fadein key="answer-key" className="overflow-hidden mt-4">
            <AnswerKeySelect
              answers={rubric["omr"].value}
              setAnswers={rubric["omr"].onChange}
              optionCount={parseInt(optionCount)}
              numberOfQuestions={questionCount}
            />
          </Fadein>
        ) : (
          <></>
        )}
        {/* Animated AnswerKey Section */}
        <AnimatePresence>
          {assessmentType === "text" && rubric["text"].value.length > 0 && (
            <RubricBuilder
              questions={rubric["text"].value}
              setQuestions={rubric["text"].onChange}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
