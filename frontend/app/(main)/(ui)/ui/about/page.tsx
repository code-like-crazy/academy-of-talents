import Image from "next/image";

import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          About Academy of Talents
        </h1>
        <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
          Learn more about our virtual school and its mission to make creativity
          and learning accessible to everyone.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-foreground/70">
            Academy of Talents is a web-based platform where users enter a
            virtual school filled with AI-powered student avatars, each
            specializing in a unique talent. Our mission is to create a
            personalized, gamified learning experience that makes creativity and
            education accessible to everyone.
          </p>
          <p className="text-foreground/70">
            Whether you're looking to solve a problem, learn a new skill, or
            just have fun, our AI-powered students are here to help you on your
            journey.
          </p>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-xl shadow-md">
          <Image
            src="/teacher-classroom-bg.webp"
            alt="Academy of Talents Classroom"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Two Modes of Interaction</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-primary/20 bg-card overflow-hidden shadow-md">
            <div className="relative aspect-video">
              <div className="from-primary/20 to-secondary/20 absolute inset-0 bg-gradient-to-br"></div>
              <Image
                src="/auth-bg.webp"
                alt="Interactive Mode"
                fill
                className="object-cover opacity-90"
              />
            </div>
            <div className="space-y-2 p-6">
              <h3 className="text-xl font-semibold">Interactive Mode</h3>
              <p className="text-foreground/70">
                A visual novel-style experience where users navigate a 3D school
                environment, interacting with AI students in an immersive
                setting.
              </p>
            </div>
          </Card>
          <Card className="border-primary/20 bg-card overflow-hidden shadow-md">
            <div className="from-primary/30 to-secondary/30 relative aspect-video bg-gradient-to-br">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🖥️</span>
              </div>
            </div>
            <div className="space-y-2 p-6">
              <h3 className="text-xl font-semibold">UI Mode</h3>
              <p className="text-foreground/70">
                A modern web design for quick and intuitive access to all
                features, perfect for users who prefer a more traditional
                interface.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Technology Behind the Magic</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <TechCard
            title="Generative AI"
            description="Powered by Gemini for real-time dialogue and problem-solving capabilities."
            icon="🧠"
          />
          <TechCard
            title="Realistic Avatars"
            description="Uses Rhubarb Lip Sync for realistic lip-syncing and ElevenLabs for text-to-speech."
            icon="🎭"
          />
          <TechCard
            title="Gamified Progress"
            description="Earn School Points for completing tasks and unlock badges as you progress."
            icon="🏆"
          />
        </div>
      </section>

      <section className="bg-card rounded-xl p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Our Values</h2>
        <div className="space-y-4">
          <ValueItem
            title="Accessibility"
            description="Making learning and creativity accessible to everyone, regardless of background or experience."
          />
          <ValueItem
            title="Innovation"
            description="Pushing the boundaries of what's possible with AI to create unique, engaging experiences."
          />
          <ValueItem
            title="Ethical AI"
            description="Our Bias Corrector ensures all outputs are inclusive, accurate, and free from harmful biases."
          />
          <ValueItem
            title="Personalization"
            description="Tailoring the learning experience to each user's unique needs and interests."
          />
        </div>
      </section>
    </div>
  );
}

function TechCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Card className="border-primary/20 bg-card p-6 shadow-sm">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </Card>
  );
}

function ValueItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-primary border-l-4 pl-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
}
