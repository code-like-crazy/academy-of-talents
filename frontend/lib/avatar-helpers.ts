export function getAvatarDescription(id: string): string {
  switch (id) {
    case "aria":
      return "Creates AI-generated art and teaches artistic techniques.";
    case "rex":
      return "Composes music, writes raps, and explains music theory.";
    case "leo":
      return "Helps debug code and teaches programming concepts.";
    case "teacher":
      return "Guides students through the school environment and provides feedback.";
    default:
      return "An AI-powered student with unique talents.";
  }
}

export function getTalentTagline(id: string): string {
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

export function getAvatarDetailedDescription(id: string): string {
  switch (id) {
    case "aria":
      return "Artistic Aria is a creative genius who specializes in all forms of visual expression. She can explain artistic techniques with enthusiasm and help you develop your own artistic skills. Whether you're interested in digital art, traditional painting, or just want to appreciate art history, Aria is your go-to talent.";
    case "rex":
      return "Rhythm Rex is a musical prodigy who can compose music, write raps, and explain complex music theory in simple terms. His responses often incorporate rhythmic elements, making learning about music both fun and engaging. From classical to hip-hop, Rex has you covered.";
    case "leo":
      return "Logic Leo excels in programming and debugging. He provides clear, structured explanations of coding concepts and helps solve technical problems methodically. Whether you're a beginner or an experienced developer, Leo can help you understand programming concepts and improve your coding skills.";
    case "teacher":
      return "The Teacher guides students through their learning journey with patience and wisdom. They provide structured feedback and help maintain a productive learning environment. As the overseer of all student AIs, the Teacher helps users navigate the school environment and get the most out of their experience.";
    default:
      return "An AI-powered student with unique talents and specialties designed to help you learn and create.";
  }
}

export function getTalentBackground(id: string): string {
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

export function getAvatarSpecialties(id: string): string[] {
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

export function getSpecialtyIcon(specialty: string): string {
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

export function getTalentCapabilities(
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

export function getTalentPrompts(id: string): string[] {
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

export function getRelatedTalents(id: string): string[] {
  const allIds = ["aria", "rex", "leo", "teacher"];
  // Filter out the current ID and return up to 3 related talents
  return allIds.filter((talentId) => talentId !== id).slice(0, 3);
}
