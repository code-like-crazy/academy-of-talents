"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

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
        >
          <Link href="/ui" className="text-2xl font-bold">
            Academy of Talents
          </Link>
        </motion.div>

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
                Interactive Mode
              </Button>
              <div className="bg-primary/20 absolute inset-0 scale-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-100" />
            </Link>
          </motion.div>
        )}
      </div>
    </header>
  );
}
