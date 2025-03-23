import Image from "next/image";
import Link from "next/link";

import { avatars } from "@/config/avatars";
import { Card } from "@/components/ui/card";

export default function UiHomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Academy of Talents
        </h1>
        <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
          Explore our virtual school filled with AI-powered student avatars,
          each specializing in a unique talent.
        </p>
      </section>

      <section className="py-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Meet Our Talented Students
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {avatars.map((avatar) => (
            <Card
              key={avatar.id}
              className="border-primary/20 bg-card hover:shadow-primary/20 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="from-primary/30 to-secondary/30 relative aspect-video bg-gradient-to-br">
                <Image
                  src={`/backgrounds/${avatar.id}.webp`}
                  alt={avatar.name}
                  fill
                  className="object-cover opacity-90"
                />
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-xl font-semibold">{avatar.name}</h3>
                <p className="text-foreground/70 text-sm">
                  {getAvatarDescription(avatar.id)}
                </p>
                <Link href={`/ui/talent/${avatar.id}`}>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 w-full rounded-xl py-2 font-medium transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card flex flex-col items-center gap-8 rounded-xl p-8 shadow-md md:flex-row">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold">
            Ready for an Immersive Experience?
          </h2>
          <p className="text-foreground/70">
            Switch to our interactive mode for a visual novel-style experience
            where you can navigate a 3D school environment.
          </p>
          <Link href="/interactive">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-3 font-medium transition-colors">
              Enter Interactive Mode
            </button>
          </Link>
        </div>
        <div className="flex-1 overflow-hidden rounded-xl shadow-xl">
          <Image
            src="/auth-bg.webp"
            alt="Interactive Mode"
            width={500}
            height={300}
            className="h-auto w-full"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          title="AI-Powered Avatars"
          description="Interact with specialized AI students who can help you learn and create."
          icon="👨‍🎓"
        />
        <FeatureCard
          title="Generative AI"
          description="Powered by Gemini for real-time dialogue and problem-solving."
          icon="🤖"
        />
        <FeatureCard
          title="Gamified Learning"
          description="Earn School Points and unlock badges as you complete tasks."
          icon="🏆"
        />
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Card className="border-primary/20 bg-card p-6">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </Card>
  );
}

function getAvatarDescription(id: string): string {
  switch (id) {
    case "aria":
      return "Creates AI-generated art and teaches artistic techniques.";
    case "rex":
      return "Composes music, writes raps, and explains music theory.";
    case "leo":
      return "Helps debug code and teaches programming concepts.";
    case "teacher":
      return "Guides students through the school environment and provides feedback.";
    default:
      return "An AI-powered student with unique talents.";
  }
}
