"use client";

import { motion } from "motion/react";

import { FloatingAnimation } from "@/components/FadeIn";

import { FeatureCard } from "./FeatureCard";

export function FeatureSection() {
  const features = [
    {
      title: "AI-Powered Avatars",
      description:
        "Interact with specialized AI students who can help you learn and create.",
      icon: "👨‍🎓",
      delay: 0.7,
    },
    {
      title: "Generative AI",
      description:
        "Powered by Gemini for real-time dialogue and problem-solving.",
      icon: "🤖",
      delay: 0.8,
    },
    {
      title: "Gamified Learning",
      description:
        "Earn School Points and unlock badges as you complete tasks.",
      icon: "🏆",
      delay: 0.9,
    },
  ];

  return (
    <motion.section
      className="relative grid grid-cols-1 gap-6 overflow-hidden py-8 md:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      >
        {/* Animated circles */}
        <motion.div
          className="bg-primary/5 absolute top-0 left-0 h-32 w-32 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="bg-secondary/5 absolute right-0 bottom-0 h-40 w-40 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      {features.map((feature, index) => (
        <FloatingAnimation key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: feature.delay,
              type: "spring",
              stiffness: 100,
            }}
          >
            <FeatureCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          </motion.div>
        </FloatingAnimation>
      ))}

      {/* Rotating decorative elements */}
      <motion.div
        className="absolute -top-16 -right-16 h-32 w-32 opacity-10"
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
        </svg>
      </motion.div>

      <motion.div
        className="absolute -bottom-16 -left-16 h-32 w-32 opacity-10"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 100 100">
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
          <rect
            x="35"
            y="35"
            width="30"
            height="30"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
    </motion.section>
  );
}
