import { useAssessment } from "@/app/(dashboard)/(teacher)/_types/AssessmentProvider";
import Fadein from "@/components/ui/fadein";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence } from "framer-motion";
import React from "react";

function Info() {
  const {
    assessmentName,
    assessmentType,
    questionCount,
    optionCount,
    setAssessmentName,
    setAssessmentType,
    setQuestionCount,
    setOptionCount,
  } = useAssessment();
  return (
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

      <div className="space-y-1">
        <Label className="text-sm font-medium">
          Assessment type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={assessmentType}
          onValueChange={(value: string) =>
            setAssessmentType(value as "omr" | "text")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select options" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="omr">OMR </SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AnimatePresence>
        {assessmentType === "omr" && (
          <>
            <Fadein className="space-y-1 overflow-hidden">
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
            </Fadein>

            <Fadein className="space-y-1">
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
            </Fadein>
          </>
        )}{" "}
      </AnimatePresence>
    </div>
  );
}

export default Info;
