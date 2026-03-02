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
  xp_profile: XpProfile;
  quiz: QuizQuestion[];
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

// Ensure day modules are registered
import "./day_02";
import "./day_03";
import "./day_04";
import "./day_05";
import "./day_06";
import "./day_07";
