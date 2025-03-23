"use client";

import { useRouter } from "next/navigation";
import { Home, LogOut, Settings } from "lucide-react";

import { AvailableAvatars } from "@/config/avatars";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SettingsDialogProps } from "./types";

export function SettingsDialog({ onSettingChange }: SettingsDialogProps) {
  const router = useRouter();

  const handleSettingClick = (setting: string) => {
    if (onSettingChange) {
      onSettingChange(setting, true);
    }
  };

  const handleAvatarChange = (avatar: AvailableAvatars) => {
    if (onSettingChange) {
      router.push(`/interactive/avatar/${avatar}`);
    }
  };

  const handleExitInteractiveMode = () => {
    router.push("/");
  };

  const handleBackToHome = () => {
    router.push("/avatar");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 h-10 w-10 rounded-full border border-slate-700/30 bg-slate-800/70 text-white backdrop-blur-sm hover:bg-slate-700/70 hover:text-white"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border border-slate-700 border-slate-700/50 bg-slate-800/90 text-white backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Avatar Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">
              Avatar Controls
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={() => handleSettingClick("animation")}
              >
                Animation
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={() => handleSettingClick("expression")}
              >
                Expression
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={() => handleSettingClick("voice")}
              >
                Voice
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={() => handleSettingClick("background")}
              >
                Background
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">
              Change Avatar
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={() => handleAvatarChange("teacher")}
              >
                Teacher
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={() => handleAvatarChange("leo")}
              >
                Leo
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={() => handleAvatarChange("aria")}
              >
                Aria
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={() => handleAvatarChange("rex")}
              >
                Rex
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">Navigation</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={handleBackToHome}
              >
                <Home className="h-4 w-4" />
                Home Page
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50 hover:text-white"
                onClick={handleExitInteractiveMode}
              >
                <LogOut className="h-4 w-4" />
                Exit Interactive
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
