"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { StudentSwitcher } from "../StudentSwitcher";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useWorkspace } from "@/context/Workspace";
import { toast } from "sonner";
import { AnswerKeySelect } from "@/app/(dashboard)/(teacher)/_components/omr/AnswerKeySelect";
import { UploadCloud } from "lucide-react";
import {
  AnswerOption,
  AssessmentType,
  Student,
  studentAnswers,
  StudentOMRState,
} from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import GradingView from "@/app/(dashboard)/(teacher)/_components/GradingView";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessment } from "@/app/(dashboard)/(teacher)/_types/AssessmentProvider";

const Display = ({
  activeStud,
  children,
  assessmentType,
}: {
  activeStud: StudentOMRState;
  children: ReactNode;
  assessmentType?: AssessmentType;
}) => {
  return (
    <div className="border w-full justify-center flex flex-col items-center md:flex-row md:items-start gap-7">
      {assessmentType !== "omr" && (
        <div className="max-w-xs w-4/5 border flex relative rounded-md overflow-hidden">
          {activeStud.file && (
            <img
              src={URL.createObjectURL(activeStud.file) || ""}
              alt="Preview"
              className={`w-full h-auto object-contain rounded-md ${activeStud.answers && "md:flex hidden"}`}
            />
          )}
          {!activeStud.answers && (
            <div className="absolute text-c1 gap-2 flex-col bg-black/75 inset-0 fx z-10">
              <div className="loader"></div>
              <span>Analyzing...</span>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default function UploadPage() {
  const { workspace } = useWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    assessmentType,
    omrScheme,
    optionCount,
    textQuestions,
    questionCount,
    students,
    studentOMRMap,
    setStudents,
    setStudentOMRMap,
  } = useAssessment();

  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const activeStud = useMemo(() => {
    return activeStudentId && studentOMRMap[activeStudentId]
      ? studentOMRMap[activeStudentId]
      : {
          file: null,
          answers:
            assessmentType === "omr"
              ? Array(questionCount).fill("-")
              : undefined,
        };
  }, [studentOMRMap, activeStudentId]);

  const rubricMeta = textQuestions.map((q) => ({
    questionNumber: q.questionNumber,
    type: q.type,
  }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeStudentId) return;

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("mode", "student");
    formData.append("rubricMeta", JSON.stringify(rubricMeta));

    setStudentOMRMap((prev) => ({
      ...prev,
      [activeStudentId]: {
        ...prev[activeStudentId],
        file: selectedFile,
      },
    }));

    if (selectedFile.size > 4_000_000) {
      toast.error("File too large. Max 4MB");
      return;
    }
    try {
      const { data } = await axios.post("/api/ocr", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // const data = [
      //   {
      //     questionNumber: 1,
      //     answers: ["Plants use sunlight to produce chlorophyll"],
      //   },
      //   {
      //     questionNumber: 2,
      //     answers: ["Rome", "London", "Las Vegas"],
      //   },
      // ];

      setStudentOMRMap((prev) => ({
        ...prev,
        [activeStudentId]: {
          ...prev[activeStudentId],
          answers: data,
        },
      }));
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  function calculateOMRScore(
    studentAnswers: AnswerOption[],
    rubric: AnswerOption[],
  ) {
    let score = 0;

    for (let i = 0; i < rubric.length; i++) {
      if (studentAnswers[i] === rubric[i]) {
        score++;
      }
    }

    return score;
  }

  useEffect(() => {
    if (students?.length) {
      setActiveStudentId(students[0].id);
      return;
    }

    const getStudents = async () => {
      if (!workspace) {
        toast.error("Cannot get class and subject");
        return;
      }
      const { data } = await axios.get(
        `/api/teacher/students?classId=${workspace?.classId}&subjectId=${workspace.subjectId}`,
      );

      const studs: Student[] = data.map((student: any) => ({
        id: student._id,
        name: student.name,
      }));

      setStudents(studs);
      setActiveStudentId(studs[0].id);
    };

    getStudents();
  }, []);

  useEffect(() => {
    if (!activeStudentId || assessmentType !== "omr") return;

    setStudentOMRMap((prev) => {
      const existing =
        prev[activeStudentId]?.answers ?? Array(questionCount).fill("-");

      if (existing.length === questionCount) {
        return prev;
      }

      return {
        ...prev,
        [activeStudentId]: {
          ...prev[activeStudentId],
          answers: Array(questionCount).fill("-"),
        },
      };
    });
  }, [questionCount, activeStudentId]);

  return (
    <div className="space-y-6 flex flex-col">
      {/* Student switcher */}
      <StudentSwitcher
        students={students}
        activeStudentId={activeStudentId}
        onChange={setActiveStudentId}
      />

      {/* Main content */}
      {activeStudentId && (
        <div className="">
          {assessmentType === "omr" ? (
            <Display assessmentType="omr" activeStud={activeStud}>
              <div className="flex flex-col gap-5">
                <AnswerKeySelect
                  setAnswers={(newAnswers, studentId) =>
                    setStudentOMRMap((prev) => {
                      const prevAnswers =
                        prev[studentId]?.answers ??
                        Array(questionCount).fill("-");
                      const nextAnswers =
                        typeof newAnswers === "function"
                          ? newAnswers(prevAnswers) // call the function
                          : newAnswers;

                      return {
                        ...prev,
                        [studentId]: {
                          ...prev[studentId],
                          answers: nextAnswers,
                        },
                      };
                    })
                  }
                  studentId={activeStudentId}
                  answers={activeStud.answers as AnswerOption[]}
                  gradingRubric={omrScheme}
                  optionCount={parseInt(optionCount)}
                />
                <Card className="border-2 border-primary">
                  <CardContent className="px-6 flex justify-between items-center">
                    <span className="text-base font-semibold">Total Score</span>
                    <span className="text-lg font-bold">
                      {calculateOMRScore(
                        activeStud.answers as AnswerOption[],
                        omrScheme,
                      )}
                      /{questionCount}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </Display>
          ) : !activeStud.file ? (
            <div className="fx flex-col py-24">
              <UploadCloud className="mb-4 text-muted-foreground" size={32} />
              <h3 className="font-semibold mb-1">Upload student script</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Upload a clear image or photo of the student’s answer sheet
              </p>
              <label>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
                <Button type="button" onClick={() => inputRef.current?.click()}>
                  Choose file
                </Button>
              </label>
            </div>
          ) : (
            <Display activeStud={activeStud}>
              {activeStud.answers && (
                <GradingView
                  rubric={textQuestions}
                  activeStudentId={activeStudentId}
                />
              )}
            </Display>
          )}
        </div>
      )}
    </div>
  );
}
