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
import { AnswerOption } from "@/app/(dashboard)/(teacher)/_types/assessments.types";
import { Skeleton } from "@/components/ui/skeleton";
import ResultSheet from "@/app/(dashboard)/(teacher)/assessment/[id]/result-sheet";

export interface AssessmentResultsResponse {
  _id: string;
  name: string;
  answerKey: AnswerOption[];
  results: Results[];
}

export default function ResultsTable() {
  const params = useParams(); // useParams returns { id: string }
  const assessmentId = params.id;

  const { data, isLoading } = useSWR<AssessmentResultsResponse>(
    `/api/teacher/assessments?assessmentId=${assessmentId}`,
    fetcher
  );

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
    []
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

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
      />

      {data?.results && activeSheet && (
        <ResultSheet
          markingScheme={data.answerKey}
          studentName={activeSheet.studentId.name}
          answers={activeSheet.answers}
          close={() => setOpen(false)}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  );
}
