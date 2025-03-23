"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

// Japanese-themed decorative elements
const SakuraBranch = ({ className }: { className?: string }) => (
  <svg
    width="120"
    height="60"
    viewBox="0 0 120 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 30C30 25 60 35 110 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="30" cy="25" r="4" fill="currentColor" fillOpacity="0.2" />
    <circle cx="45" cy="30" r="4" fill="currentColor" fillOpacity="0.2" />
    <circle cx="60" cy="28" r="4" fill="currentColor" fillOpacity="0.2" />
    <circle cx="75" cy="22" r="4" fill="currentColor" fillOpacity="0.2" />
    <circle cx="90" cy="18" r="4" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <motion.main
      className="relative container mx-auto py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <SakuraBranch className="absolute -top-4 right-0 z-0 rotate-12 text-pink-400/30" />
      <div className="relative z-10">{children}</div>
      <SakuraBranch className="absolute -bottom-4 left-0 z-0 scale-x-[-1] -rotate-12 text-pink-400/30" />
    </motion.main>
  );
}
