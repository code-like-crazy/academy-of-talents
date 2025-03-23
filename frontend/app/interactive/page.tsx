import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function InteractivePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/auth-bg.webp"
          alt="Academy of Talents"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full">
        <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center px-8 pr-12">
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/70 p-8 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-5xl font-bold text-white drop-shadow-lg">
                Academy of Talents
              </h1>
              <p className="text-lg text-white/80 drop-shadow-md">
                Welcome to our interactive learning experience
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <Link href="/interactive/school" className="w-full">
                <Button
                  size="lg"
                  className="w-full bg-purple-600 px-8 py-6 text-lg font-semibold text-white hover:bg-purple-700"
                >
                  Enter School
                </Button>
              </Link>

              <Link
                href="/ui"
                className="text-sm text-white/80 hover:text-white"
              >
                Return to UI Mode
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
