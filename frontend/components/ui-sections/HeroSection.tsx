"use client";

import { motion } from "motion/react";

export function HeroSection() {
  return (
    <motion.section
      className="space-y-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-4xl font-bold tracking-tight xl:text-5xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Welcome to Academy of Talents
      </motion.h1>
      <motion.p
        className="mx-auto max-w-3xl text-xl font-semibold text-zinc-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Explore our virtual school filled with AI-powered student avatars, each
        specializing in a unique talent.
      </motion.p>
    </motion.section>
  );
}
