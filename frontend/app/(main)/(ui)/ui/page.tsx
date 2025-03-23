import {
  FeatureSection,
  HeroSection,
  ImmersiveExperienceSection,
  StudentSection,
} from "@/components/ui-sections";

export default function UiHomePage() {
  return (
    <div className="space-y-12">
      <HeroSection />
      <StudentSection />
      <ImmersiveExperienceSection />
      <FeatureSection />
    </div>
  );
}
