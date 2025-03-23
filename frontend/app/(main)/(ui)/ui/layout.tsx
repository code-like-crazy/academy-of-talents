import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { MainContent } from "@/components/ui/main-content";
import { NavContainer } from "@/components/ui/nav-container";

interface UiLayoutProps {
  children: ReactNode;
}

export default function UiLayout({ children }: UiLayoutProps) {
  const pathname = usePathname();
  return (
    <div className="from-primary/10 to-secondary/10 min-h-screen bg-gradient-to-b">
      <Header />
      <NavContainer currentPath={pathname} />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
}
