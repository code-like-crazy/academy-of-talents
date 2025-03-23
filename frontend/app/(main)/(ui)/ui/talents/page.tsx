import Image from "next/image";
import Link from "next/link";

import { avatars } from "@/config/avatars";
import {
  getAvatarDetailedDescription,
  getAvatarSpecialties,
} from "@/lib/avatar-helpers";
import { Card } from "@/components/ui/card";

export default function TalentsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Our Talented Students
        </h1>
        <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
          Meet the AI-powered student avatars at Academy of Talents, each with
          their own unique specialties.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8">
        {avatars.map((avatar, index) => (
          <Card
            key={avatar.id}
            className="border-primary/20 bg-card overflow-hidden shadow-md"
          >
            <div
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-6`}
            >
              <div className="relative aspect-video md:w-1/3">
                <div className="from-primary/30 to-secondary/30 absolute inset-0 bg-gradient-to-br"></div>
                <Image
                  src={`/backgrounds/${avatar.id}.webp`}
                  alt={avatar.name}
                  fill
                  className="object-cover opacity-90"
                />
              </div>
              <div className="space-y-4 p-6 md:w-2/3">
                <h2 className="text-2xl font-bold">{avatar.name}</h2>
                <p className="text-foreground/70">
                  {getAvatarDetailedDescription(avatar.id)}
                </p>
                <div className="pt-4">
                  <h3 className="mb-2 text-lg font-semibold">Specialties:</h3>
                  <div className="flex flex-wrap gap-2">
                    {getAvatarSpecialties(avatar.id).map((specialty, i) => (
                      <span
                        key={i}
                        className="bg-primary/20 text-foreground/80 rounded-full px-4 py-1.5 text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href={`/ui/talent/${avatar.id}`}>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-xl px-6 py-3 font-medium transition-colors">
                    Chat with {avatar.name.split(" ").pop()}
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
