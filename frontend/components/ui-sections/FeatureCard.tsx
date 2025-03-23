"use client";

import { motion } from "motion/react";

import { Card } from "@/components/ui/card";
import { PulseAnimation } from "@/components/FadeIn";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="group border-primary/20 bg-card relative overflow-hidden rounded-2xl p-6 transition-all hover:shadow-lg">
      {/* Animated gradient background */}
      <motion.div
        className="from-primary/5 to-secondary/5 absolute inset-0 -z-10 bg-gradient-to-br via-transparent"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />

      {/* Animated icon */}
      <motion.div
        className="mb-4 text-4xl"
        whileHover={{ scale: 1.1, rotate: 5 }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          scale: { type: "spring", stiffness: 300 },
        }}
      >
        {icon}
      </motion.div>

      {/* Title with gradient effect */}
      <PulseAnimation>
        <motion.h3
          className="from-primary to-secondary mb-2 bg-gradient-to-r bg-clip-text text-xl font-semibold text-transparent"
          animate={{
            backgroundPosition: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {title}
        </motion.h3>
      </PulseAnimation>

      {/* Description with fade-in effect */}
      <motion.p
        className="text-foreground/70"
        initial={{ opacity: 0.7 }}
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {description}
      </motion.p>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </Card>
  );
}
