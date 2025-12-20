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

// 👉 use your existing workspace / class context here

type StudentAverage = {
  name: string;
  sex: string;
  averageScore: number | null;
  assessmentCount: number;
};

export default function StudentsAverageTable() {
  const { workspace } = useWorkspace();

  const { data, isLoading } = useSWR<StudentAverage[]>(
    workspace?.classId && workspace.subjectId
      ? `/api/teacher/student?classId=${workspace?.classId}&subjectId=${workspace.subjectId}`
      : null,
    fetcher
  );

  if (isLoading || !workspace) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No students found for this subject
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Sex</TableHead>
          <TableHead className="text-center">Assessments</TableHead>
          <TableHead className="text-right">Average Score</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((student) => (
          <TableRow key={student.name}>
            <TableCell className="font-medium">{student.name}</TableCell>

            <TableCell>{student.sex}</TableCell>

            <TableCell className="text-center">
              {student.assessmentCount}
            </TableCell>

            <TableCell className="text-right">
              {student.averageScore !== null ? (
                <span className="font-semibold">{student.averageScore}</span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
