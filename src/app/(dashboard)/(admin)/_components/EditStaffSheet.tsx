"use client";

import { useActionState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Staff } from "@/app/(dashboard)/(admin)/staff/page";

import { Controller, useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { toast } from "sonner";
import { filterError } from "@/server/lib";
import { useAuth } from "@/context/Auth";
import { ClassMultiSelect } from "@/app/(dashboard)/(admin)/_components/ClassMultiSelect";
import { PasswordGeneratorField } from "@/app/(dashboard)/(admin)/_components/PasswordGenerator";

const roles = ["teacher", "form teacher"] as const;

const formSchema = z.object({
  name: z.string().min(1, "Staff name is required"),
  email: z.string().email("Valid email is required"),
  subjects: z.string().optional(),
  password: z.string(),
  roles: z.array(z.enum(roles)).min(1, "Select at least one role"),
  formClass: z.array(z.string()),
});

export default function EditStaffSheet({
  open,
  onOpenChange,
  staff,
  refresh,
  close,
}: {
  refresh: () => void;
  close: () => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  staff: Staff | null;
}) {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff?.name,
      email: staff?.email,
      roles: staff?.roles || [],
      formClass: staff?.formClass || [],
    },
  });
  const [state, formAction, isPending] = useActionState(
    async (previousState: unknown, formData: FormData) => {
      try {
        const name = formData.get("name");
        const email = formData.get("email");
        const roles = formData.getAll("roles");
        const formClass = formData.getAll("formClass");
        const password = formData.get("password");

        await axios.put(`/api/admin/staff/${staff?._id}`, {
          name,
          email,
          formClass,
          roles,
          password,
        });
        toast.success("Saved Changes");
        refresh();
        close();
      } catch (error: unknown) {
        console.log(error);
        toast.error(filterError(error));
        return null;
      }
    },
    undefined
  );

  useEffect(() => {
    if (staff) {
      form.reset({
        name: staff.name,
        email: staff.email,
        roles: staff.roles ?? [],
        formClass: staff.formClass ?? [],
      });
    }
  }, [staff]);

  const rolesSelected = form.watch("roles");
  const isFormTeacher = rolesSelected.includes("form teacher");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <span className="hidden">{state}</span>
      <SheetContent side="right">
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle className="mb-4">Edit Staff</SheetTitle>

            <SheetDescription asChild>
              <Form {...form}>
                <form action={formAction} className="space-y-8">
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
                        <FormDescription>Staff name</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* EMAIL */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Email of the staff member
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ROLES */}
                  <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roles</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            {roles.map((role) => {
                              const isChecked = field.value.includes(role);

                              return (
                                <div
                                  key={role}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const current = field.value;
                                      field.onChange(
                                        checked
                                          ? [...current, role] // add role
                                          : current.filter((r) => r !== role) // remove role
                                      );
                                    }}
                                    id={role}
                                  />

                                  {/* Label */}
                                  <label
                                    htmlFor={role}
                                    className="text-sm capitalize"
                                  >
                                    {role}
                                  </label>

                                  {/* Hidden input ensures form submission works */}
                                  {isChecked && (
                                    <input
                                      type="hidden"
                                      name="roles"
                                      value={role}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* FORM CLASS SELECT: only when form teacher is selected */}
                  {isFormTeacher && (
                    <FormField
                      control={form.control}
                      name="formClass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Form Class</FormLabel>
                          <ClassMultiSelect
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormDescription>
                            Select one or more classes
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <Controller
                    control={form.control}
                    name="password"
                    render={() => (
                      <PasswordGeneratorField
                        value={staff?.password}
                        schoolName={user?.school || ""}
                      />
                    )}
                  />

                  <Button disabled={isPending} type="submit">
                    {isPending ? "Saving..." : "Save Changes"}
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
