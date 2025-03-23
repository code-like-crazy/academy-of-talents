"use client";

import { ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ZoomButtonProps } from "./types";

export function ZoomButton({ onZoom, isZoomedIn }: ZoomButtonProps) {
  const handleZoomToggle = () => {
    onZoom();
  };

  return (
    <div className="absolute top-4 right-20 flex">
      <Button
        onClick={handleZoomToggle}
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full border border-slate-700/30 bg-slate-800/70 text-white backdrop-blur-sm hover:bg-slate-700/70"
      >
        {isZoomedIn ? (
          <ZoomOut className="h-5 w-5" />
        ) : (
          <ZoomIn className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
