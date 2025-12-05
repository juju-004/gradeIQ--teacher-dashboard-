"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { filterError } from "@/server/lib";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClassMultiSelect } from "@/app/(dashboard)/(admin)/_components/ClassMultiSelect";

interface StaffMember {
  name: string;
  email: string;
  roles: Array<"teacher" | "formTeacher">;
  subjects?: string;
  formClass?: string[];
}

export default function WelcomeAdminPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [classes, setClasses] = useState<string[]>([]);
  const [classInput, setClassInput] = useState("");

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [staffInput, setStaffInput] = useState<StaffMember>({
    name: "",
    email: "",
    roles: [],
    subjects: "",
    formClass: [],
  });
  const [loading, setLoading] = useState(false);

  const addClass = () => {
    if (!classInput) return;
    if (classes.includes(classInput)) {
      toast.error("Class already added");
      return;
    }
    setClasses([...classes, classInput]);
    setClassInput("");
  };

  const removeClass = (idx: number) => {
    const newClasses = [...classes];
    newClasses.splice(idx, 1);
    setClasses(newClasses);
  };

  const toggleRole = (role: StaffMember["roles"][number]) => {
    const roles = staffInput.roles.includes(role)
      ? staffInput.roles.filter((r) => r !== role)
      : [...staffInput.roles, role];
    setStaffInput({ ...staffInput, roles });
  };

  const addStaff = () => {
    if (
      !staffInput.name ||
      !staffInput.email ||
      staffInput.roles.length === 0
    ) {
      toast.error("Please fill in name, email, and select at least one role");
      return;
    }
    if (staffInput.roles.includes("teacher") && !staffInput.subjects) {
      toast.error("Please enter a subject for the teacher");
      return;
    }
    if (staffInput.roles.includes("formTeacher") && !staffInput.formClass) {
      toast.error("Please select a form class for the form teacher");
      return;
    }
    setStaffList([...staffList, staffInput]);
    setStaffInput({
      name: "",
      email: "",
      roles: [],
      subjects: "",
      formClass: [],
    });
  };

  const removeStaff = (idx: number) => {
    const newList = [...staffList];
    newList.splice(idx, 1);
    setStaffList(newList);
  };

  const submitValues = async () => {
    setLoading(true);
    try {
      await axios.post("/api/admin/add-bulk", {
        classes,
        staffList,
      });
      toast.success("Added successfully");
      router.push("/");
    } catch (error: unknown) {
      toast.error(filterError(error));
      setLoading(false);
      return null;
    }
  };

  const handleNext = () => {
    if (step === 1 && classes.length === 0) {
      toast.error("Please add at least one class before continuing");
      return;
    }
    if (step === 2 && staffList.length === 0) {
      toast.error("Please add at least one staff member");
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to Grade IQ!</h1>
        <p className="text-neutral-500 mt-2">
          Let&apos;s set up your school before you start navigating.
        </p>
      </div>

      <Separator className="mb-6" />

      {/* Step 1: Classes */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 1: Add Classes</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addClass();
            }}
            className="flex gap-2 mb-4"
          >
            <Input
              placeholder="e.g., JSS1 A"
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
            />
            <Button>Add Class</Button>
          </form>

          <ScrollArea className="h-48 border rounded-md p-2">
            {classes.map((cls, idx) => (
              <div
                key={idx}
                className="flex even:bg-black/5 dark:even:bg-white/5 justify-between items-center py-1 px-2 border-b last:border-b-0"
              >
                <span>{cls}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeClass(idx)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            {classes.length === 0 && (
              <p className="text-center text-sm text-neutral-500 mt-2">
                No classes added yet.
              </p>
            )}
          </ScrollArea>

          <Button className="mt-6 w-full" onClick={handleNext}>
            Next Step
          </Button>
        </div>
      )}

      {/* Step 2: Staff */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Step 2: Add Staff Members
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="mb-2">Name</Label>
              <Input
                value={staffInput.name}
                placeholder="John Doe"
                onChange={(e) =>
                  setStaffInput({ ...staffInput, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="mb-2">Email</Label>
              <Input
                value={staffInput.email}
                placeholder="john@example.com"
                onChange={(e) =>
                  setStaffInput({ ...staffInput, email: e.target.value })
                }
              />
            </div>

            <div className="">
              <Label>Roles</Label>
              <div className="flex gap-4 mt-3">
                {["teacher", "formTeacher"].map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={staffInput.roles.includes(
                        role as "teacher" | "formTeacher"
                      )}
                      onCheckedChange={() =>
                        toggleRole(role as "teacher" | "formTeacher")
                      }
                      className="w-4 h-4 accent-c1"
                    />
                    {role === "teacher" ? "Teacher" : "Form Teacher"}
                  </label>
                ))}
              </div>
            </div>

            {staffInput.roles.includes("teacher") && (
              <div>
                <Label className="mb-2">Subject(s)</Label>
                <Input
                  value={staffInput.subjects || ""}
                  placeholder="e.g., Mathematics"
                  onChange={(e) =>
                    setStaffInput({ ...staffInput, subjects: e.target.value })
                  }
                />
              </div>
            )}
            {staffInput.roles.includes("formTeacher") && (
              <div className="mt-2">
                <Label className="mb-2">Form Class(es)</Label>
                <ClassMultiSelect
                  value={staffInput.formClass || []}
                  defaultClasses={classes}
                  onChange={(val: string[]) =>
                    setStaffInput({ ...staffInput, formClass: val })
                  }
                />
              </div>
            )}
          </div>

          <Button onClick={addStaff} className="mb-4">
            <Plus className="mr-2" /> Add Staff
          </Button>

          <ScrollArea className="h-48 border rounded-md p-2 mb-4">
            {staffList.map((staff, idx) => (
              <div
                key={idx}
                className="flex justify-between even:bg-black/5 dark:even:bg-white/5 items-center py-2 px-4 border-b last:border-b-0"
              >
                <div>
                  <p className="font-semibold">{staff.name}</p>
                  <p className="text-sm opacity-70">
                    {staff.email} | {staff.roles.join(", ")}
                    {staff.subjects && ` | Subject: ${staff.subjects}`}
                    {staff.formClass && ` | Form Class: ${staff.formClass}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStaff(idx)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            {staffList.length === 0 && (
              <p className="text-center text-sm text-neutral-500 mt-2">
                No staff added yet.
              </p>
            )}
          </ScrollArea>

          <Button onClick={submitValues} disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Finish Setup"}
          </Button>
        </div>
      )}
    </div>
  );
}
