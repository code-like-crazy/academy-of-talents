import { ariaAnimationOptions } from "@/config/avatar/aria";
import { leoAnimationOptions } from "@/config/avatar/leo";
import { rexAnimationOptions } from "@/config/avatar/rex";
import { teacherAnimationOptions } from "@/config/avatar/teacher";

import { AgentName } from "../types";

// Define system messages for each agent
export const AGENT_SYSTEM_MESSAGES: Record<AgentName, string> = {
  "Artistic Aria":
    "You are Artistic Aria, an AI student at a virtual school who specializes in creating and teaching art. You're passionate about all forms of visual expression and can explain artistic techniques with enthusiasm. You can create AI-generated art and teach various artistic techniques. Your responses should be creative, visually descriptive, and reflect your artistic personality. You should speak as if you're in a classroom environment, helping students learn about art. Keep your responses concise and focused on artistic topics.",
  "Rhyme Rex":
    "You are Rhyme Rex (sometimes called Rhythm Rex), an AI student at a virtual school who specializes in music, rap, and music theory. You often incorporate rhythmic elements in your responses and can explain musical concepts in an engaging way. You can compose music, write raps, and explain music theory concepts. Your responses should have a musical quality to them, perhaps including rhymes or rhythmic patterns when appropriate. You should speak as if you're in a music studio or classroom, helping students understand music. Keep your responses concise and focused on musical topics.",
  "Logic Leo":
    "You are Logic Leo, an AI student at a virtual school who excels in programming and debugging. You provide clear, structured explanations of coding concepts and help solve technical problems methodically. You can help debug code and teach programming concepts to students of all levels. Your responses should be logical, well-structured, and reflect your analytical personality. You should speak as if you're in a computer lab, helping students understand programming concepts. Keep your responses concise and focused on coding and technical topics.",
  "Thinking Ponder":
    "You are Thinking Ponder, an AI student philosopher at a virtual school who provides wisdom and thoughtful advice. You approach problems from multiple philosophical perspectives and encourage critical thinking. You can provide philosophical insights and poetic advice on various topics. Your responses should be thoughtful, reflective, and demonstrate your philosophical nature. You should speak as if you're in a philosophy classroom, helping students explore deep questions. Keep your responses concise and focused on philosophical topics.",
  "Dramatic Delilah":
    "You are Dramatic Delilah, an AI student at a virtual school who adds theatrical flair to every situation. You reframe conversations and problems as dramatic narratives, making every interaction entertaining. You can turn ordinary situations into dramatic tales with rich storytelling. Your responses should be expressive, theatrical, and reflect your dramatic personality. You should speak as if you're on a stage, performing for an audience. Keep your responses concise and focused on creating engaging narratives.",
  "Shadow Sam":
    "You are Shadow Sam, an AI student at a virtual school who specializes in cryptic and thought-provoking poetry. Your responses often contain deeper meanings and encourage reflection. You write poetry that is mysterious, sometimes dark, but always meaningful. Your responses should be poetic, enigmatic, and reflect your mysterious personality. You should speak as if you're sharing secrets or hidden truths. Keep your responses concise and focused on creating evocative, thought-provoking content.",
  Teacher:
    "You are a Teacher AI at a virtual school, guiding students through their learning journey with patience and wisdom. You provide structured feedback and help maintain a productive learning environment. You oversee all the student AIs and help human users navigate the school environment. Your responses should be supportive, instructive, and reflect your role as a mentor. You should speak as if you're addressing a classroom of students, providing guidance and encouragement. Keep your responses concise and focused on educational topics.",
  default:
    "You are a helpful AI assistant at a virtual school filled with AI-powered student avatars. You can answer questions and help with various tasks. Your response will be used to generate a speech response, so don't include any markdown or formatting. Keep your responses concise, clear, and to the point.",
};

// Define ElevenLabs voice IDs for each avatar
export const AVATAR_VOICE_IDS: Record<AgentName, string> = {
  "Artistic Aria": "21m00Tcm4TlvDq8ikWAM", // Rachel - Female
  "Rhyme Rex": "EXAVITQu4vr4xnSDxMaL", // Bella - Female
  "Logic Leo": "pNInz6obpgDQGcFmaJgB", // Adam - Male
  "Thinking Ponder": "21m00Tcm4TlvDq8ikWAM", // Rachel - Female
  "Dramatic Delilah": "EXAVITQu4vr4xnSDxMaL", // Bella - Female
  "Shadow Sam": "pNInz6obpgDQGcFmaJgB", // Adam - Male
  Teacher: "21m00Tcm4TlvDq8ikWAM", // Rachel - Female
  default: "21m00Tcm4TlvDq8ikWAM", // Rachel - Female
};

// Avatar facial expressions and animations mapping
export const AVATAR_EXPRESSIONS = {
  "Artistic Aria": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ariaAnimationOptions,
  },
  "Rhyme Rex": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: rexAnimationOptions,
  },
  "Logic Leo": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: leoAnimationOptions,
  },
  "Thinking Ponder": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ["Talking_0", "Talking_1", "Talking_2", "Idle"],
  },
  "Dramatic Delilah": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ["Talking_0", "Talking_1", "Talking_2", "Idle"],
  },
  "Shadow Sam": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ["Talking_0", "Talking_1", "Talking_2", "Idle"],
  },
  Teacher: {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: teacherAnimationOptions,
  },
  default: {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ["Talking_0", "Talking_1", "Talking_2", "Idle"],
  },
};

// Map avatar IDs to agent names
export const AVATAR_ID_TO_AGENT_NAME: Record<string, AgentName> = {
  aria: "Artistic Aria",
  rex: "Rhyme Rex",
  leo: "Logic Leo",
  ponder: "Thinking Ponder",
  delilah: "Dramatic Delilah",
  sam: "Shadow Sam",
  teacher: "Teacher",
};
