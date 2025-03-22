import { Button } from "@/components/ui/button";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  return (
    <FadeIn>
      <p className="text-4xl">Landing Page</p>
      <div className="flex max-w-60 flex-col gap-4 p-12">
        <Button variant="default">Click Me</Button>
        <Button variant="destructive">Click Me</Button>
        <Button variant="ghost">Click Me</Button>
        <Button variant="outline">Click Me</Button>
        <Button variant="secondary">Click Me</Button>
        <Button variant="link">Click Me</Button>
      </div>
    </FadeIn>
  );
}
