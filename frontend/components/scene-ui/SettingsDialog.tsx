"use client";

import { Settings } from "lucide-react";

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
  const handleSettingClick = (setting: string) => {
    if (onSettingChange) {
      onSettingChange(setting, true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 h-10 w-10 rounded-full border border-slate-700/30 bg-slate-800/70 text-white backdrop-blur-sm hover:bg-slate-700/70"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border border-slate-700 border-slate-700/50 bg-slate-800/90 text-white backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Avatar Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50"
              onClick={() => handleSettingClick("animation")}
            >
              Animation
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50"
              onClick={() => handleSettingClick("expression")}
            >
              Expression
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50"
              onClick={() => handleSettingClick("voice")}
            >
              Voice
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50"
              onClick={() => handleSettingClick("background")}
            >
              Background
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
