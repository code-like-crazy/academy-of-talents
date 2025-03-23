"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RegisterInput, registerSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
        console.log("starting");

        const response = await fetch("/api/register/", {
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

        let responseData;
        try {
          console.log("[Form] Response status:", response.status);
          console.log(
            "[Form] Response headers:",
            Object.fromEntries(response.headers.entries()),
          );

          responseData = await response.json();
        } catch (error) {
          console.error("Error parsing response:", error);
          if (response.status === 404) {
            toast.error(
              "API endpoint not found. Please check your server configuration.",
            );
          } else {
            toast.error("Server error. Please try again later.");
          }
          return;
        }

        if (!response.ok) {
          if (response.status === 409) {
            toast.error("An account with this email already exists");
          } else if (response.status === 400) {
            toast.error(responseData.message || "Invalid registration data");
          } else {
            toast.error("Registration failed. Please try again later.");
          }
          return;
        }

        toast.success("Account created successfully!");

        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          console.error("Login error after registration:", signInResult.error);
          toast.error(
            "Account created but login failed. Please try logging in manually.",
          );
          router.push("/login");
          return;
        }

        window.location.href = "/";
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    });
  }

  return (
    <>
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
                    autoComplete="email"
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-secondary/90 hover:bg-secondary/80 active:bg-secondary/70 w-full shadow-lg backdrop-blur-sm transition-colors"
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
    </>
  );
}
