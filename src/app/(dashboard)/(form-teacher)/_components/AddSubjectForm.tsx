import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/app/(dashboard)/(form-teacher)/_components/MultiSelect";
import axios from "axios";
import { toast } from "sonner";
import { filterError } from "@/server/lib";

export default function AddSubjectForm({
  mutate,
  activeClass,
}: {
  activeClass: string | null;
  mutate: () => void;
}) {
  const [newSubject, setNewSubject] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const addSubject = async (newSubject: string, t: string[]) => {
    if (!newSubject.trim()) return;

    startTransition(async () => {
      try {
        await axios.post(`/api/formteacher/${activeClass}/subjects`, {
          name: newSubject,
          teachers: t,
        });
        toast.success("Subject added");
        setNewSubject("");
        setSelectedTeachers([]);
        mutate();
      } catch (error) {
        toast.error(filterError(error));
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addSubject(newSubject, selectedTeachers);
      }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-xl mt-4"
    >
      {/* Subject Name */}
      <Input
        placeholder="New Subject"
        value={newSubject}
        name="subjectName"
        onChange={(e) => setNewSubject(e.target.value)}
      />

      {/* MultiSelect */}
      <MultiSelect
        value={selectedTeachers}
        onChange={setSelectedTeachers}
        name="assignedClasses"
      />

      {/* Submit Button */}
      <Button disabled={isPending} className="w-full">
        {isPending ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
