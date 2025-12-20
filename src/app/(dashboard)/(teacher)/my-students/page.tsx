"use client";

import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/context/Workspace";
import fetcher from "@/lib/fetcher";
import {
  MyStudent,
  myStudentsColumns,
} from "@/app/(dashboard)/(teacher)/my-students/columns";
import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";

export default function StudentsAverageTable() {
  const { workspace } = useWorkspace();

  const { data, isLoading } = useSWR<MyStudent[]>(
    workspace?.classId && workspace.subjectId
      ? `/api/teacher/students?classId=${workspace?.classId}&subjectId=${workspace.subjectId}`
      : null,
    fetcher
  );

  const columns = useMemo(
    () =>
      myStudentsColumns({
        onView: (student) => {},
      }),
    []
  );

  return (
    <div className="sm:p-6 p-3">
      <div className="flex items-start sm:items-center sm:flex-row flex-col justify-between">
        <h1 className="text-2xl font-bold mb-6">My Students</h1>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading || !workspace ? true : false}
      />
    </div>
  );
}
