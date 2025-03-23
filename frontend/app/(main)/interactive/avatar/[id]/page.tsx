import { notFound } from "next/navigation";

import { getAvatarById } from "@/config/avatars";
import { Scene } from "@/components/Scene";

type Props = {
  params: {
    id: Promise<string>;
  };
};

const AvatarPage = async ({ params }: Props) => {
  const id = await params.id;

  const avatar = getAvatarById(id);

  if (!avatar) {
    notFound();
  }

  return (
    <div className="min-h-svh w-full p-6">
      <div className="relative h-[calc(100svh-4rem)] overflow-hidden rounded-xl bg-slate-900">
        <Scene type={avatar.id} />
      </div>
    </div>
  );
};

export default AvatarPage;
