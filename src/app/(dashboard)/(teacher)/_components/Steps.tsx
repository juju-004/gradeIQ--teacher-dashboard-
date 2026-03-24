"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react";
import { useAssessment } from "@/app/(dashboard)/(teacher)/_types/AssessmentProvider";
import { toast } from "sonner";

export type Step = {
  title: string;
  component: ReactNode;
};

type StepsProps = {
  steps: Step[];
  grade: () => void;
};

export default function Steps({ steps, grade }: StepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { assessmentName, assessmentType, textQuestions } = useAssessment();

  const progress = ((currentStep + 1) / steps.length) * 100;

  const checkValidity = (step: number) => {
    if (step === 0) {
      if (assessmentName.length < 3) {
        toast.error("Please fill all required fields");
        return false;
      }
    }
    if (step === 1) {
      if (assessmentType === "text" && !textQuestions.length) {
        toast.error("Please specify a rubric");
        return false;
      }
    }
    // if (step === 2) {
    //   if (!simplifiedOMR.length) {
    //     toast.error("Please provide the results for each student");
    //     return false;
    //   }
    // }

    return true;
  };

  const next = () => {
    const isValid = checkValidity(currentStep);

    if (!isValid) return;
    currentStep === steps.length - 1 ? grade() : setCurrentStep((s) => s + 1);
  };
  return (
    <div className="sm:p-6 p-3 space-y-10 w-full overflow-hidden">
      <div className="flex items-start md:items-center md:gap-4 gap-1 md:flex-row flex-col justify-between">
        <h1 className="text-2xl font-bold mb-6">New Assessment</h1>
        <div className="space-y-2 max-w-sm flex-1">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-c1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
          <span className="flex items-start text-sm gap-2 font-medium">
            <span className="bg-c1 text-xs rounded-full w-6 h-6 fx">
              {currentStep + 1}
            </span>{" "}
            <span className="opacity-70">{steps[currentStep].title}</span>
          </span>
        </div>
      </div>
      <div className="w-full mx-auto space-y-8 pb-6">
        {/* 🧠 Step Content (Animated Pages) */}
        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="rounded-lg border bg-background"
            >
              {steps[currentStep].component}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ⏭ Navigation */}
        <div className="flex justify-between">
          <Button
            variant={"secondary"}
            disabled={currentStep === 0}
            className={`${currentStep === 0 ? "hidden" : ""} cursor-pointer`}
            onClick={() => setCurrentStep((s) => s - 1)}
          >
            <ArrowLeftCircleIcon />
            Back
          </Button>

          <Button
            className="bg-c1 text-white hover:bg-c1/90 cursor-pointer"
            onClick={next}
          >
            {currentStep === steps.length - 1 ? "Save Assessment" : "Next"}
            <ArrowRightCircleIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
