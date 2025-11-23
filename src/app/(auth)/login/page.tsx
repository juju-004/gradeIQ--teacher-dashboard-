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
import { login } from "@/server/actions";
import { Separator } from "@/components/ui/separator";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterState = {
  error: string | null;
  success: boolean;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState<
    { error: string | null },
    FormData
  >(login, { error: null });

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, toast]);
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mt-4">Login To Your Account</h1>
        <p className="text-neutral-500 mt-1">
          Signin to access your GradeIQ account
        </p>
      </div>

      <Separator className="mb-4" />
      <Form {...form}>
        <form action={formAction} className="space-y-5">
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
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-sm text-neutral-500">
            First time here?{" "}
            <Link href="/register" className="text-c1 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
}
