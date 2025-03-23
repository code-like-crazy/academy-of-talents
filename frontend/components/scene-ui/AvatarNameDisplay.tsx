import { getAvatarById } from "@/config/avatars";

import { AvatarNameDisplayProps } from "./types";

export function AvatarNameDisplay({ type }: AvatarNameDisplayProps) {
  const avatar = getAvatarById(type);

  if (!avatar) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 rounded-lg border border-slate-700/30 bg-slate-800/70 px-4 py-2 backdrop-blur-sm">
      <h2 className="text-lg font-medium text-white">{avatar.name}</h2>
    </div>
  );
}
