"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  FileText,
  Users,
  Calendar,
  BarChart3,
  Eye,
  Trash2,
} from "lucide-react";
import { useWorkspace } from "@/context/Workspace";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { AssessmentLibrarySkeleton } from "@/app/(dashboard)/(teacher)/library/library-skeleton";
import Link from "next/link";
import { LibraryEmpty } from "@/app/(dashboard)/(teacher)/library/library-empty";
import { DeleteAssessmentPopover } from "@/app/(dashboard)/(teacher)/library/delete-assessment";

export type Assessment = {
  assessmentId: string;
  name: string;
  studentsCount: number;
  averagePercentage: number;
  takenAt: string;
};

export default function TeacherAssessmentLibrary() {
  const { workspace } = useWorkspace();

  const { data, isLoading, mutate } = useSWR<Assessment[]>(
    workspace?.classId && workspace.subjectId
      ? `/api/teacher/library?classId=${workspace?.classId}&subjectId=${workspace.subjectId}`
      : null,
    fetcher,
  );

  return (
    <div className="sm:p-6 p-2 space-y-6">
      <div className="flex items-start sm:items-center sm:flex-row flex-col justify-between">
        <h1 className="text-2xl font-bold ">Library</h1>
      </div>
      <Separator />
      {/* Assessment List */}
      <div className="grid gap-4">
        {isLoading ? (
          <AssessmentLibrarySkeleton />
        ) : (data ?? []).length === 0 ? (
          <LibraryEmpty />
        ) : (
          (data ?? []).map((assessment) => (
            <Card
              key={assessment.assessmentId}
              className="hover:border-c1/50 transition"
            >
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-c1" />
                    {assessment.name}
                  </CardTitle>

                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      Avg: {assessment.averagePercentage}%
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(assessment.takenAt).toLocaleDateString()}
                </div>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {assessment.studentsCount} students
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/assessment/${assessment.assessmentId}`}>
                    <Button
                      size="sm"
                      className="bg-c1 text-white hover:bg-c1/90"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <DeleteAssessmentPopover
                    assessmentId={assessment.assessmentId}
                    refresh={mutate}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
