"use client";

import useSWR from "swr";
import axios from "axios";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import fetcher from "@/lib/fetcher";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2 } from "lucide-react";
import { useFormClass } from "@/context/FormClass";
import { studentColumns } from "@/app/(dashboard)/(form-teacher)/my-class/columns";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditStudentSheet from "@/app/(dashboard)/(form-teacher)/_components/EditStudentSheet";

export interface Student {
  _id: string;
  name: string;
  sex: "M" | "F";
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
  const [isDeleting, startDeleteTransition] = useTransition();

  // add new
  const [newStudent, setNewStudent] = useState("");
  const [sex, setSex] = useState<"M" | "F" | undefined>();

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const columns = useMemo(
    () =>
      studentColumns({
        onEdit: (student) => {
          setSelectedStudent(student);
          setOpen(true);
        },
      }),
    []
  );

  const handleDeleteSelected = (ids: any[]) => {
    let toReturn = false;

    startDeleteTransition(async () => {
      try {
        const { data } = await axios.delete(
          `/api/formteacher/${activeClass}/students`,
          {
            data: { ids },
          }
        );

        toast.success(`${data?.deletedCount} student(s) deleted`);
        mutate();
        toReturn = true;
      } catch {
        toast.error("Failed to delete");
      }
    });

    return toReturn;
  };

  // Add new Student
  const addStudent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newStudent.trim()) return;
    startTransition(async () => {
      try {
        await axios.post(`/api/formteacher/${activeClass}/students`, {
          name: newStudent,
          sex,
        });
        setNewStudent("");
        toast.success("Added");
        mutate();
      } catch {
        toast.error("Failed to add Student");
      }
    });
  };

  return (
    <div className="sm:p-6 p-3">
      <div className="flex items-start sm:items-center sm:flex-row flex-col justify-between">
        <h1 className="text-2xl font-bold mb-6">My Class ({activeClass})</h1>

        <form
          onSubmit={addStudent}
          className="flex sm:w-auto w-full sm:my-0 my-3 gap-2 mr-3"
        >
          <Input
            placeholder="New Student"
            value={newStudent}
            onChange={(e) => setNewStudent(e.target.value)}
          />
          <Select
            value={sex}
            onValueChange={(value) => setSex(value as "M" | "F")}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="F">F</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={isPending}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>

      {/* <div className="border rounded-lg p-2 shadow-sm bg-white dark:bg-neutral-900">
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
                <TableCell colSpan={6} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!students?.length && !isLoading && (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-6">
                  No students to show
                </TableCell>
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
      </div> */}

      <DataTable
        columns={columns}
        data={data?.students ?? []}
        isLoading={isLoading}
        onDelete={handleDeleteSelected}
        isDeleting={isDeleting}
      />

      {selectedStudent && activeClass && (
        <EditStudentSheet
          activeClass={activeClass}
          open={open}
          refresh={mutate}
          onOpenChange={setOpen}
          close={() => setOpen(false)}
          student={selectedStudent}
        />
      )}
    </div>
  );
}
