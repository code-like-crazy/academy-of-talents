"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const NavItem = ({ href, label, icon, isActive }: NavItemProps) => {
  return (
    <Link href={href} className="relative">
      <motion.div
        className={cn(
          "flex items-center gap-2 rounded-xl px-4 py-2 transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "hover:bg-primary/5 text-foreground/70 hover:text-foreground",
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
        {isActive && (
          <motion.div
            className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full"
            layoutId="activeNavIndicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

interface NavbarProps {
  className?: string;
  currentPath: string;
}

export function Navbar({ className, currentPath }: NavbarProps) {
  const navItems = [
    { href: "/ui", label: "Home", icon: "🏠" },
    { href: "/ui/talents", label: "Talents", icon: "🎭" },
    { href: "/ui/about", label: "About", icon: "ℹ️" },
    { href: "/ui/contact", label: "Contact", icon: "📞" },
  ];

  return (
    <motion.nav
      className={cn(
        "bg-card/80 flex items-center gap-2 rounded-2xl p-1 shadow-md backdrop-blur-sm",
        className,
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={
            item.href === "/ui"
              ? currentPath === "/ui"
              : currentPath.startsWith(item.href)
          }
        />
      ))}
    </motion.nav>
  );
}
