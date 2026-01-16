"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Student, StudentSwitcher } from "./StudentSwitcher";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useWorkspace } from "@/context/Workspace";
import { toast } from "sonner";
import { AnswerKeySelect } from "@/app/(dashboard)/(teacher)/_components/omr/AnswerKeySelect";
import { UploadCloud } from "lucide-react";
import { AnswerKeySkeleton } from "@/app/(dashboard)/(teacher)/_components/omr/AnswerKeySkeleton";
import { SimplifiedStudentOMR } from "@/app/(dashboard)/(teacher)/assessment/page";
import { AnswerOption } from "@/app/(dashboard)/(teacher)/_types/assessments.types";

export type StudentOMRState = {
  file: File | null;
  answers?: AnswerOption[]; // extracted or manually entered
};

export default function UploadPage({
  questionsCount,
  optionCount,
  setSimplifiedOMR,
}: {
  questionsCount: number;
  optionCount: number;
  setSimplifiedOMR: Dispatch<SetStateAction<SimplifiedStudentOMR[]>>;
}) {
  const { workspace } = useWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);

  const [students, setStudents] = useState<Student[] | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [studentOMRMap, setStudentOMRMap] = useState<
    Record<string, StudentOMRState>
  >({});

  const activeStud = useMemo(
    () =>
      activeStudentId && studentOMRMap[activeStudentId]
        ? studentOMRMap[activeStudentId]
        : {
            file: null,
            previewUrl: null,
          },
    [studentOMRMap, activeStudentId]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeStudentId) return;

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setStudentOMRMap((prev) => ({
      ...prev,
      [activeStudentId]: {
        ...prev[activeStudentId],
        file: selectedFile,
      },
    }));

    setTimeout(() => {
      setStudentOMRMap((prev) => ({
        ...prev,
        [activeStudentId]: {
          ...prev[activeStudentId],
          answers: Array(questionsCount).fill("-"),
        },
      }));
    }, 7000);
  };

  function getSimplifiedStudentOMR(
    students: Student[] | null,
    studentOMRMap: Record<string, StudentOMRState>
  ): SimplifiedStudentOMR[] {
    if (!students) return [];

    return students.map((student) => ({
      id: student.id,
      answers: studentOMRMap[student.id]?.answers,
    }));
  }

  const getStudents = async () => {
    if (!workspace) {
      toast.error("Cannot get class and subject");
      return;
    }
    const { data } = await axios.get(
      `/api/teacher/students?classId=${workspace?.classId}&subjectId=${workspace.subjectId}`
    );

    const studs: Student[] = data.map((student: any) => ({
      id: student._id,
      name: student.name,
    }));

    setStudents(studs);
    setActiveStudentId(studs[0].id);
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    setSimplifiedOMR(getSimplifiedStudentOMR(students, studentOMRMap));
  }, [students, studentOMRMap]);

  return (
    <div className="space-y-6 flex flex-col">
      {/* Student switcher */}
      <StudentSwitcher
        students={students}
        activeStudentId={activeStudentId}
        onChange={setActiveStudentId}
      />

      {/* Main content */}
      <div className=" mx-auto">
        {activeStudentId && (
          <div>
            {!activeStud.file ? (
              <div className="fx flex-col py-24">
                <UploadCloud className="mb-4 text-muted-foreground" size={32} />
                <h3 className="font-semibold mb-1">Upload student script</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Upload a clear image or photo of the student’s omr sheet
                </p>
                <label>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                  >
                    Choose file
                  </Button>
                </label>
              </div>
            ) : (
              <div className="border w-full flex items-start gap-7">
                <div className="max-w-xs border hidden md:flex relative rounded-md overflow-hidden">
                  <img
                    src={URL.createObjectURL(activeStud.file) || ""}
                    alt="Preview"
                    className="w-full h-auto object-contain rounded-md"
                  />
                  {!activeStud.answers && (
                    <div className="absolute text-c1 gap-2 flex-col bg-black/75 inset-0 fx z-10">
                      <div className="loader"></div>
                      <span>Analyzing...</span>
                    </div>
                  )}
                </div>
                {activeStud.answers ? (
                  <AnswerKeySelect
                    setAnswers={(newAnswers) =>
                      setStudentOMRMap((prev) => {
                        const prevAnswers =
                          prev[activeStudentId]?.answers ??
                          Array(questionsCount).fill("-");
                        const nextAnswers =
                          typeof newAnswers === "function"
                            ? newAnswers(prevAnswers) // call the function
                            : newAnswers;

                        return {
                          ...prev,
                          [activeStudentId]: {
                            ...prev[activeStudentId]!,
                            answers: nextAnswers,
                          },
                        };
                      })
                    }
                    answers={activeStud.answers}
                    optionCount={optionCount}
                    numberOfQuestions={questionsCount}
                  />
                ) : (
                  <AnswerKeySkeleton />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
