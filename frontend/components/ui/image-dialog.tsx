"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  description?: string;
}

export function ImageDialog({
  isOpen,
  onClose,
  imageUrl,
  description,
}: ImageDialogProps) {
  // Only render the dialog content if there's an image URL and the dialog is open
  if (!imageUrl && isOpen) {
    console.log("ImageDialog: No image URL provided");
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-xl border border-slate-700/50 bg-slate-800/70 p-4 backdrop-blur-sm">
        <DialogHeader className="mb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">Generated Image</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-400 hover:bg-slate-700/50 hover:text-white"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          {description && (
            <DialogDescription className="text-gray-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {imageUrl && (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt="Generated image"
              fill
              className="rounded-xl object-contain"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
