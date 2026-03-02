export type XpProfile = "easy" | "medium" | "hard";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  verseRef: string;
  verseText: string;
};

export type DayModule = {
  video_url: string;
  extra_videos?: string[];
  xp_profile: XpProfile;
  quiz: QuizQuestion[];
  title?: string;
};

export const modules: Record<number, DayModule> = {};

export function registerDay(day: number, mod: DayModule) {
  modules[day] = mod;
}

export function getDayModule(day: number): DayModule | undefined {
  return modules[day];
}

export function xpProfileForDay(day: number): XpProfile {
  const m = modules[day];
  return m?.xp_profile ?? "easy";
}

export function computeXPForProfile(profile: XpProfile, attempts: number): number {
  if (profile === "easy") return [100, 70, 50, 30][attempts - 1] ?? 30;
  if (profile === "medium") return [100, 60, 40, 20][attempts - 1] ?? 20;
  if (profile === "hard") return [100, 50, 25, 10][attempts - 1] ?? 10;
  return 10;
}

export function getAllVideos(day: number): string[] {
  const m = modules[day];
  if (!m) return [];
  const extras = Array.isArray(m.extra_videos) ? m.extra_videos.filter(Boolean) : [];
  return [m.video_url, ...extras].filter(Boolean);
}

// Register day modules without creating circular runtime deps
import day02 from "./day_02";
import day03 from "./day_03";
import day04 from "./day_04";
import day05 from "./day_05";
import day06 from "./day_06";
import day07 from "./day_07";

registerDay(2, day02);
registerDay(3, day03);
registerDay(4, day04);
registerDay(5, day05);
registerDay(6, day06);
registerDay(7, day07);
