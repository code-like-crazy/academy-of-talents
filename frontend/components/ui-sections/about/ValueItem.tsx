"use client";

import { Accessibility, Lightbulb, Shield, UserCog } from "lucide-react";

import { cn } from "@/lib/utils";

interface ValueItemProps {
  title: string;
  description: string;
  type: "accessibility" | "innovation" | "ethical" | "personalization";
  className?: string;
}

export function ValueItem({
  title,
  description,
  type,
  className,
}: ValueItemProps) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div className="mt-1 flex-shrink-0">
        {type === "accessibility" && (
          <Accessibility className="text-primary h-5 w-5" />
        )}
        {type === "innovation" && (
          <Lightbulb className="text-primary h-5 w-5" />
        )}
        {type === "ethical" && <Shield className="text-primary h-5 w-5" />}
        {type === "personalization" && (
          <UserCog className="text-primary h-5 w-5" />
        )}
      </div>
      <div className="border-primary border-l-4 pl-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-foreground/70">{description}</p>
      </div>
    </div>
  );
}
