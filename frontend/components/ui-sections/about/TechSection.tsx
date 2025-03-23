"use client";

import { TechCard } from "./TechCard";

export function TechSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Technology Behind the Magic</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TechCard
          title="Generative AI"
          description="Powered by Gemini for real-time dialogue and problem-solving capabilities."
          icon="ai"
        />
        <TechCard
          title="Realistic Avatars"
          description="Uses Rhubarb Lip Sync for realistic lip-syncing and ElevenLabs for text-to-speech."
          icon="avatars"
        />
        <TechCard
          title="Gamified Progress"
          description="Earn School Points for completing tasks and unlock badges as you progress."
          icon="gamification"
        />
      </div>
    </section>
  );
}
