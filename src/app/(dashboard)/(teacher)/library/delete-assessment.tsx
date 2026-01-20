"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState, useTransition } from "react";
import axios from "axios";
import { toast } from "sonner";
import { filterError } from "@/server/lib";

type Props = {
  assessmentId: string;
  refresh: () => void;
};

export function DeleteAssessmentPopover({ assessmentId, refresh }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await axios.delete(
          `/api/teacher/assessments?assessmentId=${assessmentId}`,
        );

        refresh();
        setOpen(false);
        toast.success("Deleted Successfully");
      } catch (err: unknown) {
        toast.error(filterError(err));
      }
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </PopoverTrigger>

      <PopoverContent side="top" align="end" className="w-72 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-semibold text-sm">Delete assessment?</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          This will permanently remove the assessment and all student
          submissions. This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
