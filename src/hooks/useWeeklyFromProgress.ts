import { useMemo } from "react";
import { type ModuleProgress, useModuleProgress } from "./useModuleProgress";
import type { WeeklyDatum } from "@/components/WeeklyBars";

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

export function computeWeeklyFromProgress(progress: ModuleProgress[], nowDate: Date = new Date()): WeeklyDatum[] {
  const now = new Date(nowDate);
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + diff);

  const map: Record<string, number> = {};
  days.forEach((d) => (map[d] = 0));

  for (const p of progress) {
    if (!p.completed || !p.completed_at) continue;
    const dt = new Date(p.completed_at);
    dt.setHours(0, 0, 0, 0);
    if (dt < monday) continue;
    const offset = Math.floor((dt.getTime() - monday.getTime()) / (24 * 60 * 60 * 1000));
    if (offset < 0 || offset > 6) continue;
    const label = days[offset];
    map[label] = 100;
  }

  return days.map((d) => ({ day: d, value: map[d] || 0 }));
}

export function useWeeklyFromProgress(): WeeklyDatum[] {
  const { progress } = useModuleProgress();
  return useMemo(() => computeWeeklyFromProgress(progress), [progress]);
}
