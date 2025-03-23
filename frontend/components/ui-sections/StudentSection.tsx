"use client";

import { motion } from "motion/react";

import { avatars } from "@/config/avatars";

import { AvatarCard } from "./AvatarCard";

export function StudentSection() {
  return (
    <motion.section
      className="py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.h2
        className="mb-6 text-2xl font-semibold"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Meet Our Talented Students
      </motion.h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {avatars.map((avatar, index) => (
          <AvatarCard key={avatar.id} avatar={avatar} index={index} />
        ))}
      </div>
    </motion.section>
  );
}
