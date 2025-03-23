"use client";

import { motion } from "motion/react";

// Japanese-themed SVG elements
const MountFuji = () => (
  <svg
    width="40"
    height="24"
    viewBox="0 0 40 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 2L30 22H10L20 2Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M15 8L10 22H20L15 8Z" fill="currentColor" fillOpacity="0.3" />
    <path d="M25 8L20 22H30L25 8Z" fill="currentColor" fillOpacity="0.3" />
    <path d="M0 22H40" stroke="currentColor" strokeOpacity="0.5" />
  </svg>
);

const JapaneseLantern = () => (
  <svg
    width="16"
    height="24"
    viewBox="0 0 16 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="2" width="4" height="2" fill="currentColor" />
    <rect x="6" y="20" width="4" height="2" fill="currentColor" />
    <rect
      x="3"
      y="4"
      width="10"
      height="16"
      rx="5"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
    />
    <path
      d="M8 4V20"
      stroke="currentColor"
      strokeOpacity="0.5"
      strokeDasharray="2 2"
    />
    <path
      d="M3 12H13"
      stroke="currentColor"
      strokeOpacity="0.5"
      strokeDasharray="2 2"
    />
  </svg>
);

export function Footer() {
  return (
    <footer className="border-primary/20 bg-background/80 relative border-t py-8 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="mb-4 flex items-center justify-center gap-6">
          <JapaneseLantern />
          <MountFuji />
          <JapaneseLantern />
        </div>

        <motion.div
          className="text-foreground/70 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-1">
            © {new Date().getFullYear()} 才能の学院 - Academy of Talents
          </p>
          <p className="text-foreground/50 text-xs">
            すべての権利を保有 • All rights reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
