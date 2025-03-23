"use client";

import { ValueItem } from "./ValueItem";

export function ValuesSection() {
  return (
    <section className="bg-card rounded-xl p-8 shadow-md">
      <h2 className="mb-6 text-2xl font-semibold">Our Values</h2>
      <div className="space-y-6">
        <ValueItem
          title="Accessibility"
          description="Making learning and creativity accessible to everyone, regardless of background or experience."
          type="accessibility"
        />
        <ValueItem
          title="Innovation"
          description="Pushing the boundaries of what's possible with AI to create unique, engaging experiences."
          type="innovation"
        />
        <ValueItem
          title="Ethical AI"
          description="Our Bias Corrector ensures all outputs are inclusive, accurate, and free from harmful biases."
          type="ethical"
        />
        <ValueItem
          title="Personalization"
          description="Tailoring the learning experience to each user's unique needs and interests."
          type="personalization"
        />
      </div>
    </section>
  );
}
