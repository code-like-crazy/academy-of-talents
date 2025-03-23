import Link from "next/link";
import { getCurrentUser } from "@/auth";

import { LogoutButton } from "@/components/auth/LogoutButton";
import FadeIn from "@/components/FadeIn";
import { Experience } from "@/components/Experience";
import { Landing } from "@/components/Landing";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <Experience />
      {/* <Landing /> */}
    </main>
  );
}
  
//   const user = await getCurrentUser();

//   return (
//     <FadeIn>
//       <p className="text-4xl">Landing Page</p>
//       {user ? (
//         <>
//           <p className="text-2xl">Welcome back, {user.name}!</p>
//           <LogoutButton redirectTo="/" />
//         </>
//       ) : (
//         <div className="space-x-4">
//           <Link href="/login">Login</Link>
//           <Link href="/register">Register</Link>
//         </div>
//       )}
//     </FadeIn>
//   );