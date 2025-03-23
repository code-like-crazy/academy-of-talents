"use client";

import { motion } from "motion/react";

import { Navbar } from "@/components/ui/navbar";

interface NavContainerProps {
  currentPath: string;
}

export function NavContainer({ currentPath }: NavContainerProps) {
  return (
    <motion.div
      className="container mx-auto flex justify-center py-2"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Navbar currentPath={currentPath} />
    </motion.div>
  );
}
