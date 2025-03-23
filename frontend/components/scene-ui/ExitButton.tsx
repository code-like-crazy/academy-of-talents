"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ExitButtonProps } from "./types";

export function ExitButton({ onExit }: ExitButtonProps) {
  const route = useRouter();

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      // Default behavior: navigate back
      route.push("/interactive/school");
    }
  };

  return (
    <Button
      variant="outline"
      className="absolute bottom-4 left-4 border border-slate-700/30 bg-slate-800/70 text-white backdrop-blur-sm hover:bg-slate-700/70 hover:text-white"
      onClick={handleExit}
    >
      <X className="mr-2 h-4 w-4" />
      Exit
    </Button>
  );
}
