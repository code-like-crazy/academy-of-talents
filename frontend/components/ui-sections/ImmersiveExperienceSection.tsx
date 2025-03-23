"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { FloatingAnimation, PulseAnimation } from "@/components/FadeIn";

export function ImmersiveExperienceSection() {
  return (
    <motion.section
      className="bg-card relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl p-8 shadow-md md:flex-row"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="from-primary/5 via-secondary/5 to-primary/5 absolute inset-0 -z-10 bg-gradient-to-br"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />

      <div className="flex-1 space-y-4">
        <PulseAnimation>
          <motion.h2
            className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Ready for an Immersive Experience?
          </motion.h2>
        </PulseAnimation>

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
            className="bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden rounded-xl px-6 py-3 font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {/* Shimmer effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-200%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative">Enter Interactive Mode</span>
          </motion.button>
        </Link>

        {/* Decorative elements */}
        <motion.div
          className="absolute -bottom-2 -left-2 h-16 w-16 opacity-10"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <svg viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </motion.div>
      </div>

      <FloatingAnimation>
        <motion.div
          className="flex-1 overflow-hidden rounded-2xl shadow-xl"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <Image
              src="/auth-bg.webp"
              alt="Interactive Mode"
              width={500}
              height={300}
              className="h-auto w-full rounded-lg transition-transform duration-700 hover:scale-110"
            />
            {/* Overlay gradient */}
            <motion.div
              className="from-primary/10 to-secondary/10 absolute inset-0 bg-gradient-to-r via-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </FloatingAnimation>
    </motion.section>
  );
}
