"use client";

import { motion } from "motion/react";

import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="border-primary/20 bg-card rounded-2xl p-6 transition-all hover:shadow-md">
      <motion.div
        className="mb-4 text-4xl"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </Card>
  );
}
