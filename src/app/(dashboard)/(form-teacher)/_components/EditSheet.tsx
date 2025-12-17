"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiSelect } from "@/app/(dashboard)/(form-teacher)/_components/MultiSelect";
import { toast } from "sonner";
import axios from "axios";
import { filterError } from "@/server/lib";

export type Subject = {
  _id: string;
  name: string;
  teachers: { _id: string; name: string }[];
};

export default function EditSubjectSheet({
  open,
  onOpenChange,
  subject,
  activeClass,
  refresh,
  close,
  isEdit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  close: () => void;
  refresh: () => void;
  activeClass: string;
  subject?: Subject | null;
  isEdit?: boolean;
}) {
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>(
    subject?.teachers.map((t) => t._id) || []
  );
  const [name, setName] = useState(subject?.name || "");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const url = isEdit
          ? `/api/formteacher/${activeClass}/subjects?subjectId=${subject?._id}`
          : `/api/formteacher/${activeClass}/subjects`;
        await axios[isEdit ? "put" : "post"](url, {
          name,
          teachers: selectedTeachers,
        });
        toast.success("Subject updated");
        refresh();
        if (isEdit) close();
        else {
          setSelectedTeachers([]);
          setName("");
        }
      } catch (error) {
        toast.error(filterError(error));
      }
    });
  };

  useEffect(() => {
    if (subject) {
      setName(subject?.name || "");
      setSelectedTeachers(subject?.teachers.map((t) => t._id));
    }
  }, [subject]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle>{isEdit ? "Edit" : "New"} Subject</SheetTitle>

            <SheetDescription asChild>
              <form onSubmit={onSubmit} className="space-y-6 mt-6">
                {/* SUBJECT NAME */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2">
                    Subject Name
                  </label>
                  <Input
                    value={name}
                    readOnly={isEdit}
                    disabled={isEdit}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* TEACHERS */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2">Teachers</label>
                  <MultiSelect
                    name="teachers"
                    value={selectedTeachers}
                    onChange={setSelectedTeachers}
                  />
                </div>

                <Button disabled={isPending} type="submit">
                  {isPending
                    ? isEdit
                      ? "Saving..."
                      : "Adding..."
                    : isEdit
                    ? "Save Changes"
                    : "Add"}
                </Button>
              </form>
            </SheetDescription>
          </SheetHeader>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
