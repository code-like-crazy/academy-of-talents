"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { registerSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterInput) {
    startTransition(async () => {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          form.setError("root", {
            message: result.message || "Registration failed",
          });
          return;
        }

        // Sign in the user after successful registration
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          form.setError("root", {
            message:
              "Registration successful but couldn&apos;t log you in. Please try logging in.",
          });
          router.push("/login");
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } catch {
        form.setError("root", {
          message: "Something went wrong. Please try again.",
        });
      }
    });
  }

  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-4 bg-card/90 w-full max-w-md border-pink-200/50 shadow-lg backdrop-blur-sm duration-1000">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          Create an Account
        </CardTitle>
        <CardDescription className="font-sans">
          Join our community and start your journey with us today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="bg-white/50 backdrop-blur-sm transition-colors focus:bg-white/80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="bg-white/50 backdrop-blur-sm transition-colors focus:bg-white/80"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="Create a password"
                      className="bg-white/50 backdrop-blur-sm transition-colors focus:bg-white/80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      className="bg-white/50 backdrop-blur-sm transition-colors focus:bg-white/80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm text-red-500">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button
              type="submit"
              className="bg-secondary/90 hover:bg-secondary/80 active:bg-secondary/70 font-heading w-full text-lg shadow-lg backdrop-blur-sm transition-colors"
              disabled={isPending}
            >
              {isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-secondary hover:text-secondary/80 decoration-primary/30 font-medium underline-offset-4 transition-colors hover:underline"
          >
            Login here
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
