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
import { useFormClass } from "@/context/FormClass";

interface Subject {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
  subjectId: string;
}

export default function SubjectTeachersPage() {
  const { activeClass } = useFormClass();

  // Subjects data
  const {
    data: subjectData,
    isLoading: subjectLoading,
    mutate: mutateSubjects,
  } = useSWR(`/api/subjectteacher/${activeClass}/subjects`, fetcher);

  // Teachers data
  const {
    data: teacherData,
    isLoading: teacherLoading,
    mutate: mutateTeachers,
  } = useSWR(`/api/subjectteacher/${activeClass}/teachers`, fetcher);

  const [isPending, startTransition] = useTransition();

  const [editMode, setEditMode] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [newSubject, setNewSubject] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  useEffect(() => {
    if (subjectData?.subjects) setSubjects(subjectData.subjects);
  }, [subjectData]);

  useEffect(() => {
    if (teacherData?.teachers) setTeachers(teacherData.teachers);
  }, [teacherData]);

  // ✅ Add Subject
  const addSubject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    startTransition(async () => {
      try {
        await axios.post(`/api/subjectteacher/${activeClass}/subjects`, {
          name: newSubject,
        });
        setNewSubject("");
        toast.success("Subject added");
        mutateSubjects();
      } catch {
        toast.error("Failed to add subject");
      }
    });
  };

  // ✅ Save Subject edits
  const saveSubjects = async () => {
    startTransition(async () => {
      try {
        await axios.put(`/api/subjectteacher/${activeClass}/subjects`, {
          subjects,
        });
        toast.success("Subjects updated");
        setEditMode(false);
        mutateSubjects();
      } catch {
        toast.error("Failed to update subjects");
      }
    });
  };

  // ✅ Add Teacher
  const addTeacher = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTeacher.trim() || !selectedSubjectId) return;

    startTransition(async () => {
      try {
        await axios.post(`/api/subjectteacher/${activeClass}/teachers`, {
          name: newTeacher,
          subjectId: selectedSubjectId,
        });
        setNewTeacher("");
        setSelectedSubjectId("");
        toast.success("Teacher added");
        mutateTeachers();
      } catch {
        toast.error("Failed to add teacher");
      }
    });
  };

  return (
    <div className="sm:p-6 p-3">
      <h1 className="text-2xl font-bold mb-6">
        Subjects & Teachers ({activeClass})
      </h1>

      {/* ================= SUBJECTS TABLE ================= */}
      <div className="border rounded-lg p-3 shadow-sm mb-8 bg-white dark:bg-neutral-900">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">Subjects</h2>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? (
                "Cancel"
              ) : (
                <>
                  <Edit /> Edit
                </>
              )}
            </Button>

            {editMode && (
              <Button size="sm" onClick={saveSubjects} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="opacity-60">
              <TableHead>#</TableHead>
              <TableHead>Subject Name</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subjectLoading && (
              <TableRow>
                <TableCell colSpan={3}>Loading...</TableCell>
              </TableRow>
            )}

            {subjects.map((subject, idx) => (
              <TableRow key={subject._id}>
                <TableCell>#{idx + 1}</TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      value={subject.name}
                      onChange={(e) => {
                        const copy = [...subjects];
                        copy[idx].name = e.target.value;
                        setSubjects(copy);
                      }}
                    />
                  ) : (
                    subject.name
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Add subject */}
        <form onSubmit={addSubject} className="flex max-w-sm gap-2 mt-4">
          <Input
            placeholder="New Subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
          <Button disabled={isPending}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>

      {/* ================= TEACHERS TABLE ================= */}
      <div className="border rounded-lg p-3 shadow-sm bg-white dark:bg-neutral-900">
        <h2 className="font-semibold text-lg mb-2">Teachers</h2>

        <Table>
          <TableHeader>
            <TableRow className="opacity-60">
              <TableHead>#</TableHead>
              <TableHead>Teacher Name</TableHead>
              <TableHead>Subject</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teacherLoading && (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            )}

            {teachers.map((teacher, idx) => {
              const subject = subjects.find((s) => s._id === teacher.subjectId);

              return (
                <TableRow key={teacher._id}>
                  <TableCell>#{idx + 1}</TableCell>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{subject?.name || "Unassigned"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Add teacher */}
        <form
          onSubmit={addTeacher}
          className="flex flex-col sm:flex-row gap-2 mt-4 max-w-lg"
        >
          <Input
            placeholder="Teacher Name"
            value={newTeacher}
            onChange={(e) => setNewTeacher(e.target.value)}
          />

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="border rounded-md p-2 bg-transparent"
          >
            <option value="">Select Subject</option>
            {subjects.map((subj) => (
              <option key={subj._id} value={subj._id}>
                {subj.name}
              </option>
            ))}
          </select>

          <Button disabled={isPending}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>
    </div>
  );
}
