"use client";

import { useEffect } from "react";
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

import axios from "axios";
import { toast } from "sonner";
import { filterError } from "@/server/lib";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Student } from "@/app/(dashboard)/(form-teacher)/my-class/page";

/* ---------------- SCHEMA ---------------- */

const formSchema = z.object({
  name: z.string().min(1, "Student name is required"),
  sex: z.enum(["M", "F"]),
});

type FormValues = z.infer<typeof formSchema>;

/* ---------------- PROPS ---------------- */

export interface IStudentSheet {
  refresh: () => void;
  close: () => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  student: Student; // edit-only
  activeClass: string;
}

/* ---------------- COMPONENT ---------------- */

export default function EditStudentSheet({
  open,
  onOpenChange,
  student,
  refresh,
  close,
  activeClass,
}: IStudentSheet) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: student.name,
      sex: student.sex,
    },
  });

  /* ---------- SUBMIT ---------- */

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.put(
        `/api/formteacher/${activeClass}/students?studentId=${student._id}`,
        values
      );

      toast.success("Student updated");
      refresh();
      close();
    } catch (error) {
      toast.error(filterError(error));
    }
  };

  /* ---------- RESET ON STUDENT CHANGE ---------- */

  useEffect(() => {
    form.reset({
      name: student.name,
      sex: student.sex,
    });
  }, [student, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle className="mb-4">Edit Student</SheetTitle>

            <SheetDescription asChild>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* NAME */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Student full name</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SEX */}
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="F">F</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button disabled={form.formState.isSubmitting} type="submit">
                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </SheetDescription>
          </SheetHeader>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
