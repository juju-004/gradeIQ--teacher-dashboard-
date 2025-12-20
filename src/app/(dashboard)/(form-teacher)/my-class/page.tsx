"use client";

import useSWR from "swr";
import axios from "axios";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import fetcher from "@/lib/fetcher";
import { Input } from "@/components/ui/input";
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

export default function StudentsPage() {
  const { activeClass } = useFormClass();
  const { data, isLoading, mutate } = useSWR(
    activeClass ? `/api/formteacher/${activeClass}/students` : null,
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

  console.log(data);

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

      <DataTable
        columns={columns}
        data={data?.students ?? []}
        isLoading={isLoading || !activeClass ? true : false}
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
