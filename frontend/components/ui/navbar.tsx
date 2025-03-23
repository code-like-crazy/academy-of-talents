"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

// Japanese-themed SVG icons
const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L4 9V21H20V9L12 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 21V12H15V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 15H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const TalentsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12L17 17M12 12L7 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 20C5 17.7909 8.13401 16 12 16C15.866 16 19 17.7909 19 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AboutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8H12.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ContactIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 6L12 13L2 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Cherry blossom decorative element
const CherryBlossom = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 4C12.5523 4 13 3.55228 13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3C11 3.55228 11.4477 4 12 4Z"
      fill="currentColor"
    />
    <path
      d="M12 22C12.5523 22 13 21.5523 13 21C13 20.4477 12.5523 20 12 20C11.4477 20 11 20.4477 11 21C11 21.5523 11.4477 22 12 22Z"
      fill="currentColor"
    />
    <path
      d="M21 13C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11C20.4477 11 20 11.4477 20 12C20 12.5523 20.4477 13 21 13Z"
      fill="currentColor"
    />
    <path
      d="M3 13C3.55228 13 4 12.5523 4 12C4 11.4477 3.55228 11 3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13Z"
      fill="currentColor"
    />
    <path
      d="M18.364 18.364C18.7545 17.9734 18.7545 17.3403 18.364 16.9497C17.9734 16.5592 17.3403 16.5592 16.9497 16.9497C16.5592 17.3403 16.5592 17.9734 16.9497 18.364C17.3403 18.7545 17.9734 18.7545 18.364 18.364Z"
      fill="currentColor"
    />
    <path
      d="M7.05025 7.05025C7.44077 6.65973 7.44077 6.02656 7.05025 5.63604C6.65973 5.24551 6.02656 5.24551 5.63604 5.63604C5.24551 6.02656 5.24551 6.65973 5.63604 7.05025C6.02656 7.44077 6.65973 7.44077 7.05025 7.05025Z"
      fill="currentColor"
    />
    <path
      d="M18.364 5.63604C17.9734 5.24551 17.3403 5.24551 16.9497 5.63604C16.5592 6.02656 16.5592 6.65973 16.9497 7.05025C17.3403 7.44077 17.9734 7.44077 18.364 7.05025C18.7545 6.65973 18.7545 6.02656 18.364 5.63604Z"
      fill="currentColor"
    />
    <path
      d="M7.05025 16.9497C6.65973 16.5592 6.02656 16.5592 5.63604 16.9497C5.24551 17.3403 5.24551 17.9734 5.63604 18.364C6.02656 18.7545 6.65973 18.7545 7.05025 18.364C7.44077 17.9734 7.44077 17.3403 7.05025 16.9497Z"
      fill="currentColor"
    />
    <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.5" />
  </svg>
);

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
          "flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors",
          isActive
            ? "bg-primary/15 text-primary"
            : "hover:bg-primary/5 text-foreground/70 hover:text-foreground",
        )}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.1 },
        }}
      >
        <span className="flex items-center justify-center">{icon}</span>
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
    { href: "/ui", label: "Home", icon: <HomeIcon /> },
    { href: "/ui/talents", label: "Talents", icon: <TalentsIcon /> },
    { href: "/ui/about", label: "About", icon: <AboutIcon /> },
    { href: "/ui/contact", label: "Contact", icon: <ContactIcon /> },
  ];

  return (
    <motion.nav
      className={cn(
        "bg-card/80 relative flex items-center gap-2 rounded-2xl p-2 shadow-md backdrop-blur-sm",
        className,
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CherryBlossom className="absolute -top-3 -left-3 h-6 w-6 rotate-45 text-pink-400/70" />

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

      <CherryBlossom className="absolute -right-3 -bottom-3 h-6 w-6 -rotate-45 text-pink-400/70" />
    </motion.nav>
  );
}
