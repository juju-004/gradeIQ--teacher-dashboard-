"use client";

import { useActionState, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useRouter } from "next/navigation";
import { filterError } from "@/server/lib";

const RegisterSchema = z.object({
  name: z.string().min(2, "Full name is too short"),
  code: z.string().min(2, "Code is too short"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  school: z.string().min(3, "School name is too short"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [_, formAction, isPending] = useActionState(
    async (previousState: unknown, formData: FormData) => {
      try {
        const name = formData.get("name");
        const code = formData.get("code");
        const school = formData.get("school");
        const email = formData.get("email");
        const password = formData.get("password");

        await axios.post("/api/create-admin", {
          name,
          code,
          school,
          email,
          password,
        });
        toast.success("Sign up successful");
        router.push("/welcome");
      } catch (error: unknown) {
        toast.error(filterError(error));
        return null;
      }
    },
    undefined
  );

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      code: "",
      email: "",
      password: "",
      school: "",
    },
  });

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mt-4">Create School (Admin)</h1>
        <p className="text-neutral-500 mt-1">
          Create your profile to access your school dashboard
        </p>
      </div>

      <Separator className="mb-4" />
      <Form {...form}>
        <form action={formAction} className="space-y-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email Address</FormLabel>
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
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input placeholder="Mainland Institution" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activation Code</FormLabel>
                <FormControl>
                  <Input placeholder="ABCDEFGHIJ" {...field} />
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
