"use client";

import { motion } from "motion/react";

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
      className="grid grid-cols-1 gap-6 md:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: feature.delay }}
        >
          <FeatureCard
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        </motion.div>
      ))}
    </motion.section>
  );
}
