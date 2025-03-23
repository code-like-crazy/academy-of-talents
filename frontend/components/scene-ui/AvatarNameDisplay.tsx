import { AvatarNameDisplayProps } from "./types";

export function AvatarNameDisplay({ type }: AvatarNameDisplayProps) {
  return (
    <div className="absolute top-4 left-4 rounded-lg border border-slate-700/30 bg-slate-800/70 px-4 py-2 backdrop-blur-sm">
      <h2 className="text-lg font-medium text-white">{type}</h2>
    </div>
  );
}
