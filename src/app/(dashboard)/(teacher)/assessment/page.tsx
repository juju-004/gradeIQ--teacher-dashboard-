"use client";

import Rubric from "@/app/(dashboard)/(teacher)/_components/Rubric";
import Steps from "@/app/(dashboard)/(teacher)/_components/Steps";
import UploadPage from "@/app/(dashboard)/(teacher)/_components/UploadPage";
import { AnswerOption } from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/context/Workspace";
import { filterError } from "@/server/lib";
import { loadingService } from "@/services/loading";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export interface SimplifiedStudentOMR {
  id: string;
  answers: AnswerOption[] | undefined;
}

export default function AssessmentSetup() {
  const { workspace } = useWorkspace();
  const { push } = useRouter();
  // Page 1 state
  const [assessmentName, setAssessmentName] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(40);
  const [optionCount, setOptionCount] = useState<"3" | "4" | "5" | "6">("4");

  // Page 2 state
  const [markingScheme, setMarkingScheme] = useState<AnswerOption[]>(
    Array(questionCount).fill("-")
  );

  // Page 3 state
  const [simplifiedOMR, setSimplifiedOMR] = useState<SimplifiedStudentOMR[]>(
    []
  );

  const startGrading = async () => {
    if (!workspace) {
      toast.error("No workspace");
      return;
    }
    loadingService.show();

    try {
      const { data } = await axios.post("/api/teacher/assessments", {
        name: assessmentName,
        classId: workspace?.classId,
        subjectId: workspace?.subjectId,
        answerKey: markingScheme,
        students: simplifiedOMR,
      });

      console.log(data);

      loadingService.hide();
      toast.success(data.message);
      push(`/assessment/${data.assessmentId}`);
    } catch (error) {
      loadingService.hide();
      toast.error(filterError(error));
    }
  };

  return (
    <Steps
      grade={startGrading}
      steps={[
        {
          title: "Assessment Info",
          component: (
            <div className="space-y-7 max-w-lg">
              {/* Assessment Name */}
              <div className="space-y-1">
                <Label htmlFor="assessmentName" className="text-sm font-medium">
                  Assessment name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="assessmentName"
                  placeholder="e.g. First Term Mathematics Exam"
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  required
                />
              </div>

              {/* Number of Questions */}
              <div className="space-y-1">
                <Label htmlFor="questionCount" className="text-sm font-medium">
                  Number of questions
                </Label>
                <Input
                  id="questionCount"
                  type="number"
                  min={1}
                  placeholder="e.g. 50"
                  value={questionCount.toString()}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  Exam options <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={optionCount}
                  onValueChange={(value: string) =>
                    setOptionCount(value as "3" | "4" | "5" | "6")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">ABC (3 options)</SelectItem>
                    <SelectItem value="4">ABCD (4 options)</SelectItem>
                    <SelectItem value="5">ABCDE (5 options)</SelectItem>
                    <SelectItem value="6">ABCDEF (6 options)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ),
        },
        {
          title: "Rubric - (Marking Scheme)",
          component: (
            <Rubric
              optionCount={parseInt(optionCount)}
              questionsCount={questionCount}
              value={markingScheme}
              onChange={setMarkingScheme}
            />
          ),
        },
        {
          title: "Student Scripts",
          component: (
            <UploadPage
              optionCount={parseInt(optionCount)}
              questionsCount={questionCount}
              setSimplifiedOMR={setSimplifiedOMR}
            />
          ),
        },
      ]}
    />
  );
}
