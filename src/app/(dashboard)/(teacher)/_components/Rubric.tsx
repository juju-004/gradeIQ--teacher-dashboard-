"use client";

import { AnswerKeySelect } from "@/app/(dashboard)/(teacher)/_components/omr/AnswerKeySelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnswerOption } from "@/app/(dashboard)/(teacher)/_types/assessments.types";

export type MarkingSchemeType = "omr" | "handwritten";

export default function Rubric({
  value,
  onChange,
  questionsCount,
  optionCount,
}: {
  value: AnswerOption[];
  onChange: Dispatch<SetStateAction<string[]>>;
  questionsCount: number;
  optionCount: number;
}) {
  const [schemeType, setSchemeType] =
    useState<MarkingSchemeType>("handwritten");
  const [manualOpen, setManualOpen] = useState(false);

  return (
    <section className="space-y-4 max-w-xl">
      <div className="space-y-4">
        {/* Scheme Type Select */}
        <div className="space-y-1">
          <Label className="text-sm font-medium">Marking scheme format</Label>

          <Select
            value={schemeType}
            onValueChange={(v) => setSchemeType(v as MarkingSchemeType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select scheme type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omr">OMR sheet (shaded answers)</SelectItem>
              <SelectItem value="handwritten">
                Handwritten (1.A, 2.B, etc.)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* File Upload */}
        <div className="space-y-1">
          <Label className="text-sm font-medium">Upload Image</Label>
          <p className="text-xs text-muted-foreground">
            Please upload a clear image of your marking scheme
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPG, PNG. Max 5MB.
          </p>
          <Input type="file" accept="image/*" className="cursor-pointer" />
        </div>

        <Button className="bg-c1 text-white hover:bg-c1/90 cursor-pointer">
          Upload
          <UploadIcon className="ml-2 h-4 w-4" />
        </Button>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-solid border-muted"></div>
          <span className="mx-3 text-sm text-muted-foreground font-medium">
            OR
          </span>
          <div className="flex-grow border-t border-solid border-muted"></div>
        </div>

        {/* Pick Answers Manually */}
        <Button
          variant={"secondary"}
          onClick={() => setManualOpen((prev) => !prev)}
        >
          Pick answers manually
        </Button>

        {/* Animated AnswerKey Section */}
        <AnimatePresence>
          {manualOpen && (
            <motion.div
              key="answer-key"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden mt-4"
            >
              <AnswerKeySelect
                answers={value}
                setAnswers={onChange}
                optionCount={optionCount}
                numberOfQuestions={questionsCount}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
