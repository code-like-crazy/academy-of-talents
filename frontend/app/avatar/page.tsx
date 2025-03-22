import { Scene } from "@/components/Scene";

const AvatarTestPage = () => {
  return (
    <div className="min-h-svh w-full">
      <div className="relative h-[calc(100svh-5rem)] overflow-hidden rounded-xl bg-slate-200">
        <Scene />
      </div>
    </div>
  );
};

export default AvatarTestPage;
