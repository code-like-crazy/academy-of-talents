import Link from "next/link";
import { getCurrentUser } from "@/auth";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { Experience } from "@/components/Experience";
import FadeIn from "@/components/FadeIn";
import { Landing } from "@/components/Landing";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      {/* <Experience /> */}
      <Landing />
      {/* <LogoutButton /> */}
    </main>
  );
}
