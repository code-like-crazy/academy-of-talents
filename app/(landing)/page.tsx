import Link from "next/link";
import { getCurrentUser } from "@/auth";

import { LogoutButton } from "@/components/auth/LogoutButton";
import FadeIn from "@/components/FadeIn";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <FadeIn>
      <p className="text-4xl">Landing Page</p>
      {user ? (
        <>
          <p className="text-2xl">Welcome back, {user.name}!</p>
          <LogoutButton redirectTo="/" />
        </>
      ) : (
        <div className="space-x-4">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      )}
    </FadeIn>
  );
}
