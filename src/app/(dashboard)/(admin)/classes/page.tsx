"use client";

import useSWR from "swr";
import axios from "axios";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import fetcher from "@/lib/fetcher";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { classColumns } from "@/app/(dashboard)/(admin)/classes/columns";

export default function ClassesPage() {
  const { data, isLoading, mutate } = useSWR("/api/admin/classes", fetcher);
  const [isPending, startTransition] = useTransition();
  const [isPending2, startTransition2] = useTransition();
  const [newClass, setNewClass] = useState("");

  // Add new class
  const addClass = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newClass.trim()) return;
    startTransition(async () => {
      try {
        await axios.post("/api/admin/classes", { name: newClass });
        setNewClass("");
        toast.success("Added");
        mutate();
      } catch {
        toast.error("Failed to add class");
      }
    });
  };

  const handleDeleteSelected = (ids: any[]) => {
    let toReturn = false;

    startTransition2(async () => {
      try {
        const { data } = await axios.delete("/api/admin/classes", {
          data: { ids },
        });

        toast.success(`${data?.deletedCount} class(es) deleted`);
        toReturn = true;
        mutate();
      } catch {
        toast.error("Failed to delete");
      }
    });

    return toReturn;
  };
  return (
    <div className="sm:p-6 p-3">
      <div className="flex items-start sm:items-center sm:flex-row flex-col justify-between">
        <h1 className="text-2xl font-bold mb-6">Class(es)</h1>

        <form
          onSubmit={addClass}
          className="flex sm:w-auto w-full sm:my-0 my-3 gap-2 mr-3"
        >
          <Input
            placeholder="New Class Name"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
          />
          <Button disabled={isPending}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>

      <DataTable
        columns={classColumns}
        data={data?.classes ?? []}
        isLoading={isLoading}
        onDelete={handleDeleteSelected}
        isDeleting={isPending2}
      />
    </div>
  );
}
