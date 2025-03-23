import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAvatarById } from "@/config/avatars";
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl shadow-md">
        <div className="from-primary/30 to-secondary/30 absolute inset-0 z-0 bg-gradient-to-br"></div>
        <Image
          src={`/backgrounds/${avatar.id}.webp`}
          alt={avatar.name}
          fill
          className="z-0 object-cover opacity-90"
        />
        <div className="from-background/80 absolute inset-0 z-10 bg-gradient-to-t to-transparent"></div>
        <div className="absolute bottom-0 left-0 z-20 p-8">
          <h1 className="text-foreground text-4xl font-bold drop-shadow-md">
            {avatar.name}
          </h1>
          <p className="text-foreground/90 mt-2 max-w-2xl text-xl">
            {getTalentTagline(avatar.id)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-card p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Specialties</h2>
            <div className="space-y-2">
              {getTalentSpecialties(avatar.id).map((specialty, index) => (
                <div
                  key={index}
                  className="bg-primary/10 flex items-center rounded-xl p-3"
                >
                  <div className="mr-3 text-xl">
                    {getSpecialtyIcon(specialty)}
                  </div>
                  <span className="text-foreground/80">{specialty}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-primary/20 bg-card p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                Start Chat
              </Button>
              <Button
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 w-full"
              >
                View Sample Projects
              </Button>
              <Link href="/interactive/school">
                <Button
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10 w-full"
                >
                  Meet in 3D Environment
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-8 md:col-span-2">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">About {avatar.name}</h2>
            <div className="text-foreground/70 space-y-4">
              <p>{getTalentDescription(avatar.id)}</p>
              <p>{getTalentBackground(avatar.id)}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              How {avatar.name.split(" ").pop()} Can Help You
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {getTalentCapabilities(avatar.id).map((capability, index) => (
                <Card
                  key={index}
                  className="border-primary/20 bg-card p-4 shadow-sm"
                >
                  <h3 className="mb-2 font-medium">{capability.title}</h3>
                  <p className="text-foreground/70 text-sm">
                    {capability.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Example Prompts</h2>
            <div className="space-y-3">
              {getTalentPrompts(avatar.id).map((prompt, index) => (
                <div
                  key={index}
                  className="border-primary/20 bg-background hover:bg-primary/5 rounded-xl border p-4 transition-colors"
                >
                  <p className="text-foreground/70">"{prompt}"</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Related Talents */}
      <section className="pt-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Other Talents You Might Like
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {getRelatedTalents(avatar.id).map((relatedId) => {
            const relatedAvatar = getAvatarById(relatedId);
            if (!relatedAvatar) return null;

            return (
              <Link key={relatedId} href={`/ui/talent/${relatedId}`}>
                <Card className="border-primary/20 bg-card hover:shadow-primary/20 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-video">
                    <div className="from-primary/20 to-secondary/20 absolute inset-0 z-0 bg-gradient-to-br"></div>
                    <Image
                      src={`/backgrounds/${relatedId}.webp`}
                      alt={relatedAvatar.name}
                      fill
                      className="z-0 object-cover opacity-90"
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
            );
          })}
        </div>
      </section>
    </div>
  );
}

// Helper functions to provide content based on avatar ID

function getTalentTagline(id: string): string {
  switch (id) {
    case "aria":
      return "Unleash your creativity with digital and traditional art techniques";
    case "rex":
      return "Explore the world of music, from composition to theory";
    case "leo":
      return "Master programming concepts and solve technical challenges";
    case "teacher":
      return "Your guide to navigating the Academy of Talents";
    default:
      return "Discover unique talents and skills";
  }
}

function getTalentDescription(id: string): string {
  switch (id) {
    case "aria":
      return "Artistic Aria is a creative genius who specializes in all forms of visual expression. With a passion for both digital and traditional art, she can help you explore various artistic techniques, understand art history, and develop your own unique style.";
    case "rex":
      return "Rhythm Rex is a musical prodigy with an ear for melody and rhythm. He excels in music composition, lyric writing, and explaining complex music theory concepts in an accessible way. His responses often incorporate rhythmic elements, making learning about music both fun and engaging.";
    case "leo":
      return "Logic Leo is a programming expert who excels in solving technical problems with clear, structured thinking. He can help debug code, explain programming concepts, and guide you through algorithm design with patience and precision.";
    case "teacher":
      return "The Teacher is your primary guide at the Academy of Talents. With extensive knowledge of all subjects and a nurturing approach to education, they help students navigate the learning environment, provide structured feedback, and ensure a productive educational experience.";
    default:
      return "An AI-powered student with unique talents and specialties designed to help you learn and create.";
  }
}

function getTalentBackground(id: string): string {
  switch (id) {
    case "aria":
      return "Aria developed her artistic talents by studying the works of masters across centuries and experimenting with countless mediums. She believes that art is a universal language that can express ideas beyond words, and she's dedicated to helping others find their artistic voice.";
    case "rex":
      return "Rex discovered his musical abilities at an early age, finding patterns and rhythms in everyday sounds. He's studied everything from classical composition to modern production techniques, and loves helping others discover the joy of creating and understanding music.";
    case "leo":
      return "Leo became fascinated with logic puzzles and programming as a way to build and solve complex systems. He approaches coding as both a science and an art form, finding elegant solutions to technical challenges while making the concepts accessible to learners of all levels.";
    case "teacher":
      return "The Teacher has dedicated their career to guiding students through their educational journey. With a background in multiple disciplines and a passion for helping others succeed, they create a supportive learning environment where every student can thrive.";
    default:
      return "Each AI student at the Academy of Talents brings their own unique background and approach to their specialty.";
  }
}

function getTalentSpecialties(id: string): string[] {
  switch (id) {
    case "aria":
      return [
        "Digital Art",
        "Traditional Painting",
        "Art History",
        "Creative Design",
        "Visual Expression",
      ];
    case "rex":
      return [
        "Music Composition",
        "Rap Writing",
        "Music Theory",
        "Rhythm Analysis",
        "Sound Design",
      ];
    case "leo":
      return [
        "Programming",
        "Debugging",
        "Algorithm Design",
        "Technical Problem Solving",
        "Code Optimization",
      ];
    case "teacher":
      return [
        "Educational Guidance",
        "Learning Strategies",
        "Student Mentoring",
        "School Navigation",
        "Progress Tracking",
      ];
    default:
      return ["AI Learning", "Creative Assistance", "Problem Solving"];
  }
}

function getSpecialtyIcon(specialty: string): string {
  const iconMap: Record<string, string> = {
    // Aria
    "Digital Art": "🖌️",
    "Traditional Painting": "🎨",
    "Art History": "🏛️",
    "Creative Design": "✨",
    "Visual Expression": "👁️",

    // Rex
    "Music Composition": "🎵",
    "Rap Writing": "🎤",
    "Music Theory": "📝",
    "Rhythm Analysis": "🥁",
    "Sound Design": "🔊",

    // Leo
    Programming: "💻",
    Debugging: "🐛",
    "Algorithm Design": "🧩",
    "Technical Problem Solving": "🔧",
    "Code Optimization": "⚡",

    // Teacher
    "Educational Guidance": "🧭",
    "Learning Strategies": "📚",
    "Student Mentoring": "🤝",
    "School Navigation": "🏫",
    "Progress Tracking": "📊",

    // Default
    "AI Learning": "🤖",
    "Creative Assistance": "💡",
    "Problem Solving": "🔍",
  };

  return iconMap[specialty] || "✨";
}

function getTalentCapabilities(
  id: string,
): Array<{ title: string; description: string }> {
  switch (id) {
    case "aria":
      return [
        {
          title: "Art Creation Guidance",
          description:
            "Learn techniques for creating digital or traditional artwork with step-by-step guidance.",
        },
        {
          title: "Style Analysis",
          description:
            "Understand different artistic styles and movements throughout history.",
        },
        {
          title: "Color Theory",
          description:
            "Learn how to use color effectively in your artistic compositions.",
        },
        {
          title: "Composition Tips",
          description:
            "Get advice on creating balanced and visually appealing compositions.",
        },
      ];
    case "rex":
      return [
        {
          title: "Music Composition",
          description:
            "Get help creating melodies, harmonies, and complete musical pieces.",
        },
        {
          title: "Lyric Writing",
          description:
            "Develop your skills in writing meaningful and rhythmic lyrics.",
        },
        {
          title: "Music Theory Explanations",
          description:
            "Understand scales, chords, progressions, and other music theory concepts.",
        },
        {
          title: "Genre Exploration",
          description:
            "Learn about different musical genres and their distinctive characteristics.",
        },
      ];
    case "leo":
      return [
        {
          title: "Code Debugging",
          description:
            "Get help identifying and fixing bugs in your programming code.",
        },
        {
          title: "Algorithm Explanation",
          description:
            "Learn how different algorithms work and when to use them.",
        },
        {
          title: "Programming Concepts",
          description:
            "Understand fundamental and advanced programming concepts.",
        },
        {
          title: "Code Optimization",
          description:
            "Improve your code's efficiency, readability, and performance.",
        },
      ];
    case "teacher":
      return [
        {
          title: "Learning Path Creation",
          description: "Get personalized guidance on your educational journey.",
        },
        {
          title: "Study Techniques",
          description:
            "Learn effective methods for studying and retaining information.",
        },
        {
          title: "School Navigation",
          description:
            "Get help finding resources and connecting with other AI students.",
        },
        {
          title: "Progress Assessment",
          description:
            "Receive feedback on your learning progress and areas for improvement.",
        },
      ];
    default:
      return [
        {
          title: "Personalized Assistance",
          description:
            "Get help tailored to your specific needs and interests.",
        },
        {
          title: "Skill Development",
          description:
            "Improve your abilities in various areas with guided practice.",
        },
      ];
  }
}

function getTalentPrompts(id: string): string[] {
  switch (id) {
    case "aria":
      return [
        "Can you explain the difference between impressionism and expressionism?",
        "I want to create a digital portrait. What techniques should I focus on?",
        "How do I use color theory to create more impactful artwork?",
        "What are some exercises to improve my drawing skills?",
        "Can you analyze the composition of the Mona Lisa?",
      ];
    case "rex":
      return [
        "How do I write a catchy chorus for my song?",
        "Can you explain what a minor pentatonic scale is?",
        "What's the difference between a verse and a bridge in songwriting?",
        "How can I create interesting drum patterns?",
        "Can you help me understand chord progressions?",
      ];
    case "leo":
      return [
        "What's the difference between a for loop and a while loop?",
        "Can you help me debug this JavaScript function?",
        "How do sorting algorithms work?",
        "What's the best way to optimize this database query?",
        "Can you explain object-oriented programming concepts?",
      ];
    case "teacher":
      return [
        "How can I make the most of my time at the Academy of Talents?",
        "What learning strategies would you recommend for visual learners?",
        "Can you help me create a study schedule?",
        "How do I track my progress in different subjects?",
        "Which AI students should I talk to if I'm interested in creative writing?",
      ];
    default:
      return [
        "How can you help me with my project?",
        "What's the best way to learn this skill?",
        "Can you give me feedback on my work?",
        "What resources do you recommend for beginners?",
      ];
  }
}

function getRelatedTalents(id: string): string[] {
  const allIds = ["aria", "rex", "leo", "teacher"];
  // Filter out the current ID and return up to 3 related talents
  return allIds.filter((talentId) => talentId !== id).slice(0, 3);
}
