import { Scene } from "@/components/Scene";

const AvatarTestPage = () => {
  return (
    <div className="min-h-svh w-full p-6">
      <div className="relative h-[calc(100svh-4rem)] overflow-hidden rounded-xl bg-slate-900">
        <Scene />
      </div>
    </div>
  );
};

export default AvatarTestPage;
