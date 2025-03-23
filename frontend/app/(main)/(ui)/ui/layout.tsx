import { ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";

interface UiLayoutProps {
  children: ReactNode;
}

export default function UiLayout({ children }: UiLayoutProps) {
  return (
    <div className="from-primary/10 to-secondary/10 min-h-screen bg-gradient-to-b">
      <header className="border-primary/20 bg-background/80 border-b backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4">
          <Link href="/ui" className="text-primary text-2xl font-bold">
            Academy of Talents
          </Link>

          <Dock>
            <DockItem className="text-sm font-medium">
              <DockItem className="text-sm font-medium">
                <Link href="/ui">
                  <DockIcon>Home</DockIcon>
                  <DockLabel>Home</DockLabel>
                </Link>
              </DockItem>
            </DockItem>
            <DockItem className="text-sm font-medium">
              <DockItem className="text-sm font-medium">
                <Link href="/ui/talents">
                  <DockIcon>Talents</DockIcon>
                  <DockLabel>Talents</DockLabel>
                </Link>
              </DockItem>
            </DockItem>
            <DockItem className="text-sm font-medium">
              <DockItem className="text-sm font-medium">
                <Link href="/ui/about">
                  <DockIcon>About</DockIcon>
                  <DockLabel>About</DockLabel>
                </Link>
              </DockItem>
            </DockItem>
            <DockItem className="text-sm font-medium">
              <DockItem className="text-sm font-medium">
                <Link href="/ui/contact">
                  <DockIcon>Contact</DockIcon>
                  <DockLabel>Contact</DockLabel>
                </Link>
              </DockItem>
            </DockItem>
          </Dock>

          <Link href="/interactive">
            <Button
              variant="outline"
              className="border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Interactive Mode
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-8">{children}</main>

      <footer className="border-primary/20 bg-background/80 border-t py-6 backdrop-blur-sm">
        <div className="text-foreground/70 container mx-auto text-center">
          <p>
            © {new Date().getFullYear()} Academy of Talents. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
