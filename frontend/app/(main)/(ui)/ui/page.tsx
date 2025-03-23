"use client";

import { motion } from "motion/react";

import {
  FeatureSection,
  HeroSection,
  ImmersiveExperienceSection,
  StudentSection,
} from "@/components/ui-sections";

export default function UiHomePage() {
  return (
    <motion.div
      className="relative min-h-screen space-y-16 overflow-hidden py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background gradient */}
      <motion.div
        className="from-background to-background pointer-events-none fixed inset-0 -z-20 bg-gradient-to-br"
        animate={{
          backgroundImage: [
            "radial-gradient(circle at 0% 0%, rgba(var(--primary-rgb), 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(var(--secondary-rgb), 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(var(--primary-rgb), 0.03) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Animated mesh background */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        <svg width="100%" height="100%">
          <pattern
            id="mesh-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <motion.path
              d="M 20 0 L 40 20 L 20 40 L 0 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              animate={{
                strokeDasharray: ["0,100", "100,0"],
                strokeDashoffset: [0, 100],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#mesh-pattern)" />
        </svg>
      </motion.div>

      <motion.div
        className="container mx-auto space-y-16 px-4"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.5,
          staggerChildren: 0.2,
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <HeroSection />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StudentSection />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <ImmersiveExperienceSection />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <FeatureSection />
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-primary/20 fixed h-2 w-2 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.div>
  );
}
