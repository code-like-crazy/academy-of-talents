"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { Avatar } from "@/config/avatars";
import { getAvatarDescription } from "@/lib/avatar-helpers";
import { Card } from "@/components/ui/card";
import { FloatingAnimation } from "@/components/FadeIn";

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
      whileHover={{ scale: 1.02 }}
    >
      <Card className="group border-primary/20 bg-card overflow-hidden rounded-2xl transition-all">
        <FloatingAnimation>
          <div className="from-primary/30 to-secondary/30 relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-200%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.2,
              }}
            />
            <Image
              src={`/backgrounds/${avatar.id}.webp`}
              alt={avatar.name}
              fill
              className="rounded-lg object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </FloatingAnimation>

        <motion.div
          className="space-y-2 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 * index }}
        >
          <motion.h3
            className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-xl font-semibold text-transparent"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.3,
            }}
          >
            {avatar.name}
          </motion.h3>

          <motion.p
            className="text-foreground/70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 * index }}
          >
            {getAvatarDescription(avatar.id)}
          </motion.p>

          <Link href={`/ui/talent/${avatar.id}`} className="block">
            <motion.button
              className="bg-primary text-primary-foreground hover:bg-primary/90 relative mt-2 w-full overflow-hidden rounded-xl py-2 font-medium transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-200%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span className="relative">Learn More</span>
            </motion.button>
          </Link>
        </motion.div>
      </Card>
    </motion.div>
  );
}
