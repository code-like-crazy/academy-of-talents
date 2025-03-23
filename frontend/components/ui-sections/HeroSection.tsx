"use client";

import { motion } from "motion/react";

import { FadeIn, PulseAnimation } from "@/components/FadeIn";

export function HeroSection() {
  const gradientStyle = {
    background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <motion.section
      className="relative space-y-8 overflow-hidden py-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute top-40 right-10 h-32 w-32 rounded-full bg-purple-500 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-32 w-32 rounded-full bg-pink-500 blur-3xl" />
      </motion.div>

      <PulseAnimation>
        <motion.h1
          className="text-4xl font-bold tracking-tight xl:text-5xl"
          style={gradientStyle}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Welcome to Academy of Talents
        </motion.h1>
      </PulseAnimation>

      <FadeIn delay={0.4}>
        <motion.p
          className="mx-auto max-w-3xl text-xl font-semibold text-zinc-500"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Explore our virtual school filled with AI-powered student avatars,
          each specializing in a unique talent.
        </motion.p>
      </FadeIn>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-0 -right-4 h-24 w-24 opacity-20"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
    </motion.section>
  );
}
