"use client";

import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { register } from "@/server/actions";
import SchoolSelect from "@/app/(auth)/_components/SchoolSelect";
import { Separator } from "@/components/ui/separator";

const RegisterSchema = z.object({
  name: z.string().min(2, "Full name is too short"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  subject: z.string().min(2, "Enter a valid subject"),
  school: z.string().min(1, "Please select a school"),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(register, undefined);

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      subject: "",
      school: "",
    },
  });

  useEffect(() => {
    if (state?.error) toast.success(state?.error);
  }, [state]);

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mt-4">Create Your Account</h1>
        <p className="text-neutral-500 mt-1">Join Grade IQ in a few clicks</p>
      </div>

      <Separator className="mb-4" />
      <Form {...form}>
        <form action={formAction} className="space-y-5">
          <FormField
            name="school"
            control={form.control}
            render={({ field }) => (
              <>
                <SchoolSelect value={field.value} onChange={field.onChange} />
                <input type="hidden" name="school" value={field.value ?? ""} />
              </>
            )}
          />

          {/* Name */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter a secure password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-c1 disabled:bg-c1/70 hover:bg-c1/80 text-white rounded-lg"
          >
            {isPending ? "Creating..." : "Create Account"}
          </Button>
          <p className="text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-c1 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
}
