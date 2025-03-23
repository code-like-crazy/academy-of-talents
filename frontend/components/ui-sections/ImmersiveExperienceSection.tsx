"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export function ImmersiveExperienceSection() {
  return (
    <motion.section
      className="bg-card flex flex-col items-center gap-8 rounded-2xl p-8 shadow-md md:flex-row"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex-1 space-y-4">
        <motion.h2
          className="text-2xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Ready for an Immersive Experience?
        </motion.h2>
        <motion.p
          className="text-foreground/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Switch to our interactive mode for a visual novel-style experience
          where you can navigate a 3D school environment.
        </motion.p>
        <Link href="/interactive">
          <motion.button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-3 font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Enter Interactive Mode
          </motion.button>
        </Link>
      </div>
      <motion.div
        className="flex-1 overflow-hidden rounded-2xl shadow-xl"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Image
          src="/auth-bg.webp"
          alt="Interactive Mode"
          width={500}
          height={300}
          className="h-auto w-full rounded-2xl"
        />
      </motion.div>
    </motion.section>
  );
}
