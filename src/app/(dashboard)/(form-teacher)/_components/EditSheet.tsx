"use client";

import { useActionState, useEffect, useState } from "react";
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
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  close: () => void;
  refresh: () => void;
  activeClass: string;
  subject: Subject | null;
}) {
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>(
    subject?.teachers.map((t) => t._id) || []
  );

  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      try {
        const name = formData.get("name");

        await axios.put(
          `/api/formteacher/${activeClass}/subjects?subjectId=${subject?._id}`,
          {
            name,
            teachers: selectedTeachers,
          }
        );

        toast.success("Subject updated");
        refresh();
        close();
      } catch (error) {
        toast.error(filterError(error));
      }
    },
    undefined
  );

  useEffect(() => {
    if (subject) {
      document
        .querySelector<HTMLInputElement>('input[name="name"]')
        ?.setAttribute("value", subject.name);
    }
  }, [subject]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div className="hidden">{state ? "" : ""}</div>
      <SheetContent side="right">
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle>Edit Subject</SheetTitle>

            <SheetDescription asChild>
              <form action={formAction} className="space-y-6 mt-6">
                {/* SUBJECT NAME */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2">
                    Subject Name
                  </label>
                  <Input name="name" defaultValue={subject?.name} />
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
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </SheetDescription>
          </SheetHeader>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
