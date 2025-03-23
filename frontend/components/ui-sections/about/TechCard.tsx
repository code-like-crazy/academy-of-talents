"use client";

import { Brain, Trophy, Users } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TechCardProps {
  title: string;
  description: string;
  icon: "ai" | "avatars" | "gamification";
  className?: string;
}

export function TechCard({
  title,
  description,
  icon,
  className,
}: TechCardProps) {
  return (
    <Card
      className={cn(
        "border-primary/20 bg-card shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <CardHeader className="pb-0">
        <motion.div
          className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon === "ai" && <Brain className="text-primary h-6 w-6" />}
          {icon === "avatars" && <Users className="text-primary h-6 w-6" />}
          {icon === "gamification" && (
            <Trophy className="text-primary h-6 w-6" />
          )}
        </motion.div>
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-foreground/70">{description}</p>
      </CardContent>
    </Card>
  );
}
