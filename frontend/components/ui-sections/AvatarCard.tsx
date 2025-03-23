"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { Avatar } from "@/config/avatars";
import { getAvatarDescription } from "@/lib/avatar-helpers";
import { Card } from "@/components/ui/card";

interface AvatarCardProps {
  avatar: Avatar;
  index: number;
}

export function AvatarCard({ avatar, index }: AvatarCardProps) {
  return (
    <motion.div
      key={avatar.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <Card className="border-primary/20 bg-card hover:shadow-primary/20 overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="from-primary/30 to-secondary/30 relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br">
          <Image
            src={`/backgrounds/${avatar.id}.webp`}
            alt={avatar.name}
            fill
            className="rounded-lg object-cover opacity-90"
          />
        </div>
        <div className="space-y-2 p-4">
          <h3 className="text-xl font-semibold">{avatar.name}</h3>
          <p className="text-foreground/70 text-sm">
            {getAvatarDescription(avatar.id)}
          </p>
          <Link href={`/ui/talent/${avatar.id}`}>
            <motion.button
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 w-full rounded-xl py-2 font-medium transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More
            </motion.button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
