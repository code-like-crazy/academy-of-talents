"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

// Japanese-themed SVG elements
const ToriGate = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 6H20V8H4V6Z" fill="currentColor" />
    <path d="M6 8H8V20H6V8Z" fill="currentColor" />
    <path d="M16 8H18V20H16V8Z" fill="currentColor" />
    <path d="M3 4H21V6H3V4Z" fill="currentColor" />
    <path d="M10 10H14V12H10V10Z" fill="currentColor" />
  </svg>
);

const WavyPattern = ({ className }: { className?: string }) => (
  <svg
    width="120"
    height="20"
    viewBox="0 0 120 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0 10C5 5 10 15 15 10C20 5 25 15 30 10C35 5 40 15 45 10C50 5 55 15 60 10C65 5 70 15 75 10C80 5 85 15 90 10C95 5 100 15 105 10C110 5 115 15 120 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeOpacity="0.5"
      strokeLinecap="round"
    />
  </svg>
);

interface HeaderProps {
  showInteractiveButton?: boolean;
}

export function Header({ showInteractiveButton = true }: HeaderProps) {
  return (
    <header className="border-primary/20 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <ToriGate />
          <div className="flex flex-col">
            <Link href="/ui" className="text-2xl font-bold tracking-wide">
              才能の学院
            </Link>
            <span className="text-foreground/70 text-sm">
              Academy of Talents
            </span>
          </div>
        </motion.div>

        <WavyPattern className="text-primary/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />

        {showInteractiveButton && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden"
          >
            <Link href="/interactive">
              <Button
                variant="outline"
                className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 relative z-10 rounded-xl transition-all duration-300"
              >
                <span className="mr-2">体験モード</span>
                <span>Interactive Mode</span>
              </Button>
              <div className="bg-primary/20 absolute inset-0 scale-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-100" />
            </Link>
          </motion.div>
        )}
      </div>
    </header>
  );
}
