"use client";

import Image from "next/image";

export function MissionSection() {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Our Mission</h2>
        <p className="text-foreground/70">
          Academy of Talents is a web-based platform where users enter a virtual
          school filled with AI-powered student avatars, each specializing in a
          unique talent. Our mission is to create a personalized, gamified
          learning experience that makes creativity and education accessible to
          everyone.
        </p>
        <p className="text-foreground/70">
          Whether you're looking to solve a problem, learn a new skill, or just
          have fun, our AI-powered students are here to help you on your
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
  );
}
