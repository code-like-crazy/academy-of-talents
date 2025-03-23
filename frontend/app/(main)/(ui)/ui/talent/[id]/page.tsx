"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";

import { getAvatarById } from "@/config/avatars";
import {
  getAvatarDetailedDescription,
  getAvatarSpecialties,
  getRelatedTalents,
  getSpecialtyIcon,
  getTalentBackground,
  getTalentCapabilities,
  getTalentPrompts,
  getTalentTagline,
} from "@/lib/avatar-helpers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TalentPageProps {
  params: {
    id: string;
  };
}

export default function TalentPage({ params }: TalentPageProps) {
  const avatar = getAvatarById(params.id);

  if (!avatar) {
    notFound();
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.div
        className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="from-primary/30 to-secondary/30 absolute inset-0 z-0 bg-gradient-to-br"></div>
        <Image
          src={`/backgrounds/${avatar.id}.webp`}
          alt={avatar.name}
          fill
          className="z-0 rounded-2xl object-cover opacity-90"
        />
        <div className="from-background/80 absolute inset-0 z-10 bg-gradient-to-t to-transparent"></div>
        <motion.div
          className="absolute bottom-0 left-0 z-20 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-foreground text-4xl font-bold drop-shadow-md">
            {avatar.name}
          </h1>
          <p className="text-foreground/90 mt-2 max-w-2xl text-xl">
            {getTalentTagline(avatar.id)}
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-primary/20 bg-card rounded-2xl p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Specialties</h2>
            <div className="space-y-2">
              {getAvatarSpecialties(avatar.id).map((specialty, index) => (
                <motion.div
                  key={index}
                  className="bg-primary/10 flex items-center rounded-xl p-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: "rgba(var(--primary), 0.15)",
                  }}
                >
                  <motion.div
                    className="mr-3 text-xl"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {getSpecialtyIcon(specialty)}
                  </motion.div>
                  <span className="text-foreground/80">{specialty}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="border-primary/20 bg-card rounded-2xl p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl">
                  Start Chat
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10 w-full rounded-xl"
                >
                  View Sample Projects
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href={`/interactive/avatar/${avatar.id}`}>
                  <Button
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10 w-full rounded-xl"
                  >
                    Meet in 3D Environment
                  </Button>
                </Link>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="space-y-8 md:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-semibold">About {avatar.name}</h2>
            <div className="text-foreground/70 space-y-4">
              <p>{getAvatarDetailedDescription(avatar.id)}</p>
              <p>{getTalentBackground(avatar.id)}</p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="mb-4 text-2xl font-semibold">
              How {avatar.name.split(" ").pop()} Can Help You
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {getTalentCapabilities(avatar.id).map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index + 0.6 }}
                >
                  <Card className="border-primary/20 bg-card rounded-xl p-4 shadow-sm transition-all hover:shadow-md">
                    <h3 className="mb-2 font-medium">{capability.title}</h3>
                    <p className="text-foreground/70 text-sm">
                      {capability.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="mb-4 text-2xl font-semibold">Example Prompts</h2>
            <div className="space-y-3">
              {getTalentPrompts(avatar.id).map((prompt, index) => (
                <motion.div
                  key={index}
                  className="border-primary/20 bg-background hover:bg-primary/5 rounded-xl border p-4 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index + 0.7 }}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "rgba(var(--primary), 0.05)",
                  }}
                >
                  <p className="text-foreground/70">"{prompt}"</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>

      {/* Related Talents */}
      <motion.section
        className="pt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="mb-6 text-2xl font-semibold">
          Other Talents You Might Like
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {getRelatedTalents(avatar.id).map((relatedId, index) => {
            const relatedAvatar = getAvatarById(relatedId);
            if (!relatedAvatar) return null;

            return (
              <motion.div
                key={relatedId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index + 0.8 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/ui/talent/${relatedId}`}>
                  <Card className="border-primary/20 bg-card hover:shadow-primary/20 overflow-hidden rounded-2xl transition-all hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <div className="from-primary/20 to-secondary/20 absolute inset-0 z-0 bg-gradient-to-br"></div>
                      <Image
                        src={`/backgrounds/${relatedId}.webp`}
                        alt={relatedAvatar.name}
                        fill
                        className="z-0 rounded-lg object-cover opacity-90"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">
                        {relatedAvatar.name}
                      </h3>
                      <p className="text-foreground/70 mt-1 text-sm">
                        {getTalentTagline(relatedId)}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
}
