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

interface Student {
  _id: string;
  name: string;
}

function DeleteStudentButton({
  refresh,
  pending,
  id,
  activeClass,
}: {
  refresh: () => void;
  pending: boolean;
  id: string;
  activeClass: string;
}) {
  const [isPending, startTransition] = useTransition();

  // Delete class instantly
  const deleteStudent = async () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/formteacher/${activeClass}/students?id=${id}`);
        toast.success("Student deleted");
        refresh();
      } catch {
        toast.error("Failed to delete student");
      }
    });
  };

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={deleteStudent}
      disabled={pending || isPending}
    >
      <span className="sm:flex hidden">
        {isPending ? "Deleting..." : "Delete"}
      </span>
      {isPending ? (
        <Loader2 className="sm:hidden animate-spin" />
      ) : (
        <Trash2 className="sm:hidden" />
      )}
    </Button>
  );
}

export default function StudentsPage() {
  const { activeClass } = useFormClass();
  const { data, isLoading, mutate } = useSWR(
    `/api/formteacher/${activeClass}/students`,
    fetcher
  );
  const [isPending, startTransition] = useTransition();

  const [editMode, setEditMode] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState("");

  useEffect(() => {
    if (data?.students) setStudents(data.students);
  }, [data]);

  // Add new Student
  const addStudent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newStudent.trim()) return;
    startTransition(async () => {
      try {
        await axios.post(`/api/formteacher/${activeClass}/students`, {
          name: newStudent,
        });
        setNewStudent("");
        toast.success("Added");
        mutate();
      } catch {
        toast.error("Failed to add Student");
      }
    });
  };

  // Save all edits at once
  const saveAll = async () => {
    startTransition(async () => {
      try {
        await axios.put(`/api/formteacher/${activeClass}/students`, {
          students,
        });
        toast.success("Students updated");
        setEditMode(false);
        mutate();
      } catch {
        toast.error("Failed to update");
      }
    });
  };

  return (
    <div className="sm:p-6 p-3">
      <h1 className="text-2xl font-bold mb-6">My Class ({activeClass})</h1>

      <div className="border rounded-lg p-2 shadow-sm bg-white dark:bg-neutral-900">
        <div className="flex justify-end items-center gap-2 mb-2 pr-3">
          <Button
            className="pr-4"
            onClick={() => setEditMode(!editMode)}
            size="sm"
          >
            {editMode ? (
              "Cancel"
            ) : (
              <>
                <Edit /> Edit
              </>
            )}
          </Button>
          {editMode && (
            <Button onClick={saveAll} size="sm" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="opacity-60">
              <TableHead>#</TableHead>
              <TableHead>Student Name</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            )}

            {students?.map((cls, idx) => (
              <TableRow key={cls._id} className="even:bg-muted/80">
                <TableCell className="font-medium">#{idx + 1}</TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      value={cls.name}
                      onChange={(e) => {
                        const copy = [...students];
                        copy[idx].name = e.target.value;
                        setStudents(copy);
                      }}
                    />
                  ) : (
                    cls.name
                  )}
                </TableCell>
                <TableCell align="right">
                  <DeleteStudentButton
                    id={cls._id}
                    activeClass={activeClass || ""}
                    refresh={mutate}
                    pending={isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Fixed input at the bottom to quickly add a Student */}
        <form onSubmit={addStudent} className="flex max-w-[25rem] gap-2 mt-4">
          <Input
            placeholder="New Student"
            value={newStudent}
            onChange={(e) => setNewStudent(e.target.value)}
          />
          <Button disabled={isPending}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>
    </div>
  );
}
