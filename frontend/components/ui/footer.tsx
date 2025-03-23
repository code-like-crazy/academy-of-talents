"use client";

import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="border-primary/20 bg-background/80 border-t py-6 backdrop-blur-sm">
      <motion.div
        className="text-foreground/70 container mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p>
          © {new Date().getFullYear()} Academy of Talents. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
