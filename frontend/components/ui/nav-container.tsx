"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";

import { Navbar } from "@/components/ui/navbar";

// Japanese-themed decorative elements
const CirclePattern = ({ className }: { className?: string }) => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="30"
      cy="30"
      r="28"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.3"
    />
    <circle
      cx="30"
      cy="30"
      r="20"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.2"
    />
    <circle
      cx="30"
      cy="30"
      r="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />
  </svg>
);

export function NavContainer() {
  const pathname = usePathname();

  return (
    <div className="bg-background/30 relative py-4">
      <CirclePattern className="text-primary/20 absolute top-1/2 -left-10 -translate-y-1/2" />
      <CirclePattern className="text-primary/20 absolute top-1/2 -right-10 -translate-y-1/2" />

      <motion.div
        className="container mx-auto flex justify-center"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Navbar currentPath={pathname} />
      </motion.div>
    </div>
  );
}
