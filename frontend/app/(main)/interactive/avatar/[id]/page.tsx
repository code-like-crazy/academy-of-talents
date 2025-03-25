import Image from "next/image";
import { notFound } from "next/navigation";

import { getAvatarBackground, getAvatarById } from "@/config/avatars";
import { Scene } from "@/components/Scene";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const AvatarPage = async ({ params }: Props) => {
  const { id } = await params;

  const avatar = getAvatarById(id);

  if (!avatar) {
    notFound();
  }

  return (
    <div className="min-h-svh w-full px-3 pt-3">
      <div className="relative h-[calc(100svh-24px)] overflow-hidden rounded-xl bg-slate-900">
        <Image
          src={getAvatarBackground(avatar.id)}
          alt="Avatar background"
          fill
          className="object-cover"
        />
        <Scene type={avatar.id} />
      </div>
    </div>
  );
};

export default AvatarPage;
