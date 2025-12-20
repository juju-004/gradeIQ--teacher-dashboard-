"use client";

import useSWR from "swr";
import axios from "axios";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import fetcher from "@/lib/fetcher";
import { useFormClass } from "@/context/FormClass";
import EditSubjectSheet from "@/app/(dashboard)/(form-teacher)/_components/EditSheet";
import { IDName } from "@/server/types";
import { DataTable } from "@/components/ui/data-table";
import { subjectColumns } from "@/app/(dashboard)/(form-teacher)/subjects-teachers/columns";
import { FAB } from "@/components/ui/floating-button";

export type SubjectWithTeachers = {
  _id: string;
  name: string;
  teachers: IDName[];
};

export default function SubjectTeachersPage() {
  const { activeClass } = useFormClass();

  const { data, isLoading, mutate } = useSWR(
    activeClass ? `/api/formteacher/${activeClass}/subjects` : null,
    fetcher
  );

  const [selectedSubject, setSelectedSubject] =
    useState<SubjectWithTeachers | null>(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const columns = useMemo(
    () =>
      subjectColumns({
        onEdit: (student) => {
          setSelectedSubject(student);
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
          `/api/formteacher/${activeClass}/subjects`,
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

  return (
    <div className="sm:p-6 p-3">
      <div className="flex justify-between items-center pr-4">
        <h1 className="text-2xl font-bold mb-6">
          Subjects & Teachers ({activeClass})
        </h1>
        <FAB onClick={() => setOpen2(true)} />
      </div>

      <DataTable
        columns={columns}
        data={data?.subjects ?? []}
        isLoading={isLoading}
        onDelete={handleDeleteSelected}
        isDeleting={isDeleting}
      />

      <EditSubjectSheet
        open={open}
        onOpenChange={setOpen}
        subject={selectedSubject}
        activeClass={activeClass!}
        refresh={mutate}
        close={() => setOpen(false)}
        isEdit
      />
      <EditSubjectSheet
        open={open2}
        onOpenChange={setOpen2}
        activeClass={activeClass!}
        refresh={mutate}
        close={() => setOpen(false)}
      />
    </div>
  );
}
