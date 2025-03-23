import { ReactNode } from "react";

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { MainContent } from "@/components/ui/main-content";
import { NavContainer } from "@/components/ui/nav-container";

// Japanese-themed background pattern
const JapanesePattern = () => (
  <div className="pointer-events-none absolute inset-0 z-0 opacity-5">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="sakura-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 0C22 10 30 18 40 20C30 22 22 30 20 40C18 30 10 22 0 20C10 18 18 10 20 0Z"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sakura-pattern)" />
    </svg>
  </div>
);

interface UiLayoutProps {
  children: ReactNode;
}

export default function UiLayout({ children }: UiLayoutProps) {
  return (
    <div className="from-primary/5 to-secondary/10 relative min-h-screen overflow-hidden bg-gradient-to-b">
      <JapanesePattern />
      <div className="relative z-10">
        <Header />
        <NavContainer />
        <MainContent>{children}</MainContent>
        <Footer />
      </div>
    </div>
  );
}
