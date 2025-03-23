import {
  AboutHeader,
  InteractionModesSection,
  MissionSection,
  TechSection,
  ValuesSection,
} from "@/components/ui-sections/about";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <AboutHeader />
      <MissionSection />
      <InteractionModesSection />
      <TechSection />
      <ValuesSection />
    </div>
  );
}
