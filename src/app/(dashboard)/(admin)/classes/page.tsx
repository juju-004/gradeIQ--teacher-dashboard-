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

function DeleteClassButton({
  refresh,
  pending,
  cls,
}: {
  refresh: () => void;
  pending: boolean;
  cls: string;
}) {
  const [isPending, startTransition] = useTransition();

  // Delete class instantly
  const deleteClass = async () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/admin/classes/${cls}`);
        toast.success("Class deleted");
        refresh();
      } catch {
        toast.error("Failed to delete class");
      }
    });
  };

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={deleteClass}
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

export default function ClassesPage() {
  const { data, isLoading, mutate } = useSWR("/api/admin/classes", fetcher);
  const [isPending, startTransition] = useTransition();

  const [editMode, setEditMode] = useState(false);
  const [classList, setClassList] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");

  useEffect(() => {
    if (data?.classes) setClassList(data.classes?.list);
  }, [data]);

  // Add new class
  const addClass = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newClass.trim()) return;
    startTransition(async () => {
      try {
        const newClassList = [...classList, newClass.trim()];
        await axios.put("/api/admin/classes", {
          classes: newClassList,
        });
        setClassList(newClassList);
        setNewClass("");
        toast.success("Added");
        mutate();
      } catch {
        toast.error("Failed to add class");
      }
    });
  };

  // Save all edits at once
  const saveAll = async () => {
    startTransition(async () => {
      try {
        await axios.put("/api/admin/classes", { classes: classList });
        toast.success("Classes updated");
        setEditMode(false);
        mutate();
      } catch {
        toast.error("Failed to update classes");
      }
    });
  };

  return (
    <div className="sm:p-6 p-3">
      <h1 className="text-2xl font-bold mb-6">Class Management</h1>

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
              <TableHead>Class Name</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            )}

            {classList?.map((cls, idx) => (
              <TableRow key={cls} className="even:bg-muted/80">
                <TableCell className="font-medium">#{idx + 1}</TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      value={cls}
                      onChange={(e) => {
                        const copy = [...classList];
                        copy[idx] = e.target.value;
                        setClassList(copy);
                      }}
                    />
                  ) : (
                    cls
                  )}
                </TableCell>
                <TableCell align="right">
                  <DeleteClassButton
                    cls={cls}
                    refresh={mutate}
                    pending={isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Fixed input at the bottom to quickly add a class */}
        <form onSubmit={addClass} className="flex gap-2 mt-4">
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
    </div>
  );
}
