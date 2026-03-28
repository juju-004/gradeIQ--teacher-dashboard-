"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useParams } from "next/navigation";
import {
  Results,
  resultsColumns,
} from "@/app/(dashboard)/(teacher)/assessment/[id]/columns";
import {
  Answer,
  AnswerOption,
  Question,
} from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import { Skeleton } from "@/components/ui/skeleton";
import ResultSheet from "@/app/(dashboard)/(teacher)/assessment/[id]/result-sheet";
import {
  gradeOMR,
  gradeText,
} from "@/app/(dashboard)/(teacher)/_grading/gradeOMR";

export type Result = {
  _id: string;
  studentId: { name: string };
  answers: string[] | Answer[];
};

export interface AssessmentResultsResponse {
  _id: string;
  name: string;
  type: "omr" | "text";
  rubric: AnswerOption[] | Question[];
  results: Result[];
}

export default function ResultsTable() {
  const params = useParams(); // useParams returns { id: string }
  const assessmentId = params.id;

  const { data, isLoading } = useSWR<AssessmentResultsResponse>(
    `/api/teacher/assessments?assessmentId=${assessmentId}`,
    fetcher,
  );

  console.log(data);

  const tableData = useMemo(() => {
    if (!data) return [];

    // ---------- OMR ----------
    if (data.type === "omr") {
      const rubric = data.rubric as string[];

      return data.results.map((student) => {
        const graded = gradeOMR(rubric, student.answers as string[]);

        return {
          name: student.studentId.name,
          score: graded.score.toString(),
          totalScore: graded.total.toString(),
          percentage: graded.percentage.toFixed(0),
          answers: student.answers,
        };
      });
    }

    // ---------- TEXT ----------
    const rubric = data.rubric as Question[];

    return data.results.map((student) => {
      const graded = gradeText(rubric, student.answers as Answer[]);

      return {
        name: student.studentId.name,
        score: graded.score.toString(),
        totalScore: graded.total.toString(),
        percentage: graded.percentage.toFixed(0),
        answers: student.answers,
      };
    });
  }, [data]);

  const [open, setOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState<Results | null>(null);
  const columns = useMemo(
    () =>
      resultsColumns({
        onView: (student) => {
          setActiveSheet(student);
          setOpen(true);
        },
      }),
    [],
  );

  return (
    <div className="sm:p-6 p-3">
      <div className="flex items-start sm:items-center sm:flex-row flex-col justify-between">
        <h1 className="text-2xl font-bold fx gap-3 flex-wrap mb-6">
          {isLoading ? (
            <Skeleton className="h-8 w-22 rounded-md" />
          ) : (
            <>{data?.name}</>
          )}{" "}
          <span>|</span> <span className="opacity-60">Results</span>
        </h1>
      </div>

      <DataTable columns={columns} data={tableData} isLoading={isLoading} />

      {data?.results && activeSheet && (
        <ResultSheet
          name={activeSheet.name}
          rubric={data.rubric}
          type={data.type}
          percentage={activeSheet.percentage}
          score={activeSheet.score}
          totalScore={activeSheet.totalScore}
          answers={activeSheet.answers}
          close={() => setOpen(false)}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  );
}
