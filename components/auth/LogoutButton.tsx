"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

type Props = {
  title?: string;
  label?: string;
  className?: string;
  icon?: ReactNode;
  redirectTo?: string;
};

export const LogoutButton = ({
  title,
  className,
  label = "Sign Out",
  icon,
  redirectTo = "/",
}: Props) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push(redirectTo);
  };

  return (
    <Button
      title={title || "Sign Out"}
      onClick={handleSignOut}
      variant="destructive"
      className={cn("font-bold", className)}
    >
      {icon && <span className="size-5">{icon}</span>}
      {label}
    </Button>
  );
};
