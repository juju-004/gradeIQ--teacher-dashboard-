"use client";

import useSWR from "swr";
import axios from "axios";
import { FormEvent, useEffect, useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import fetcher from "@/lib/fetcher";
import { Input } from "@/components/ui/input";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { useFormClass } from "@/context/FormClass";
import AddSubjectForm from "@/app/(dashboard)/(form-teacher)/_components/AddSubjectForm";
import { filterError } from "@/server/lib";
import { MultiSelect } from "@/app/(dashboard)/(form-teacher)/_components/MultiSelect";
import EditSubjectSheet from "@/app/(dashboard)/(form-teacher)/_components/EditSheet";

export type Teacher = {
  _id: string;
  name: string;
};

export type SubjectWithTeachers = {
  _id: string;
  name: string;
  teachers: Teacher[];
};

export default function SubjectTeachersPage() {
  const { activeClass } = useFormClass();

  const {
    data: subjectData,
    isLoading,
    mutate: mutateSubjects,
  } = useSWR(`/api/formteacher/${activeClass}/subjects`, fetcher);

  const [isPending, startTransition] = useTransition();
  const [subjects, setSubjects] = useState<SubjectWithTeachers[]>([]);

  const [selectedSubject, setSelectedSubject] =
    useState<SubjectWithTeachers | null>(null);
  const [open, setOpen] = useState(false);

  const deleteSubject = async (subjectId: string) => {
    try {
      await axios.delete(
        `/api/formteacher/${activeClass}/subjects?subjectId=${subjectId}`
      );
      toast.success("Subject deleted successfully");
      mutateSubjects(); // refresh the data
    } catch (error) {
      toast.error("Failed to delete subject");
      console.error(error);
    }
  };

  useEffect(() => {
    if (subjectData?.subjects) setSubjects(subjectData.subjects);
  }, [subjectData]);

  return (
    <div className="sm:p-6 p-3">
      <h1 className="text-2xl font-bold mb-6">
        Subjects & Teachers ({activeClass})
      </h1>

      <div className="border rounded-lg p-3 shadow-sm mb-8 bg-white dark:bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow className="opacity-60">
              <TableHead>#</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Assigned Teacher(s)</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!subjects?.length && !isLoading && (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-6">
                  No subjects to show
                </TableCell>
              </TableRow>
            )}

            {subjects.map((subject, idx) => (
              <TableRow key={subject._id}>
                <TableCell>#{idx + 1}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>
                  {subject.teachers.length === 0
                    ? "No teacher assigned"
                    : subject.teachers.map((t) => t.name).join(", ")}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="disabled:opacity-40"
                    disabled={isPending}
                    onClick={() => deleteSubject(subject._id)}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 disabled:opacity-40"
                    disabled={isPending}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setOpen(true);
                    }}
                  >
                    <Edit size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AddSubjectForm mutate={mutateSubjects} activeClass={activeClass} />
      </div>

      <EditSubjectSheet
        open={open}
        onOpenChange={setOpen}
        subject={selectedSubject}
        activeClass={activeClass!}
        refresh={mutateSubjects}
        close={() => setOpen(false)}
      />
    </div>
  );
}
