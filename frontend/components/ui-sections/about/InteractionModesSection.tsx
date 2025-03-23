"use client";

import Image from "next/image";
import { Monitor } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function InteractionModesSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Two Modes of Interaction</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InteractionModeCard
          title="Interactive Mode"
          description="A visual novel-style experience where users navigate a 3D school environment, interacting with AI students in an immersive setting."
          imageSrc="/auth-bg.webp"
          imageAlt="Interactive Mode"
        />
        <UICard
          title="UI Mode"
          description="A modern web design for quick and intuitive access to all features, perfect for users who prefer a more traditional interface."
        />
      </div>
    </section>
  );
}

interface InteractionModeCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

function InteractionModeCard({
  title,
  description,
  imageSrc,
  imageAlt,
}: InteractionModeCardProps) {
  return (
    <Card className="border-primary/20 bg-card overflow-hidden shadow-md">
      <div className="relative aspect-video">
        <div className="from-primary/20 to-secondary/20 absolute inset-0 bg-gradient-to-br"></div>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover opacity-90"
        />
      </div>
      <CardContent className="space-y-2 p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-foreground/70">{description}</p>
      </CardContent>
    </Card>
  );
}

interface UICardProps {
  title: string;
  description: string;
}

function UICard({ title, description }: UICardProps) {
  return (
    <Card className="border-primary/20 bg-card overflow-hidden shadow-md">
      <div className="from-primary/30 to-secondary/30 relative aspect-video bg-gradient-to-br">
        <div className="absolute inset-0 flex items-center justify-center">
          <Monitor className="h-16 w-16 text-white" />
        </div>
      </div>
      <CardContent className="space-y-2 p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-foreground/70">{description}</p>
      </CardContent>
    </Card>
  );
}
