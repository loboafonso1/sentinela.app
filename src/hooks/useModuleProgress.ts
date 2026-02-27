import { useState, useCallback, useEffect } from "react";

export interface ModuleProgress {
  id: string;
  module_day: number;
  completed: boolean;
  completed_at: string | null;
  quiz_score: number | null;
}

const STORAGE_KEY = "sentinela_module_progress";

function loadProgress(): ModuleProgress[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProgress(progress: ModuleProgress[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useModuleProgress() {
  const [progress, setProgress] = useState<ModuleProgress[]>(loadProgress);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const isModuleUnlocked = (day: number): boolean => {
    if (day === 1) return true;
    const prevDay = progress.find((p) => p.module_day === day - 1);
    if (!prevDay?.completed || !prevDay.completed_at) return false;
    const completedAt = new Date(prevDay.completed_at);
    const now = new Date();
    return now.getTime() - completedAt.getTime() >= 24 * 60 * 60 * 1000;
  };

  const getTimeUntilUnlock = (day: number): number | null => {
    if (day === 1) return null;
    const prevDay = progress.find((p) => p.module_day === day - 1);
    if (!prevDay?.completed || !prevDay.completed_at) return null;
    const completedAt = new Date(prevDay.completed_at);
    const unlockAt = completedAt.getTime() + 24 * 60 * 60 * 1000;
    const remaining = unlockAt - Date.now();
    return remaining > 0 ? remaining : null;
  };

  const completeModule = async (day: number, score: number) => {
    const existing = progress.find((p) => p.module_day === day);
    if (existing?.completed) return;

    let updated: ModuleProgress[];
    if (existing) {
      updated = progress.map((p) =>
        p.module_day === day
          ? { ...p, completed: true, completed_at: new Date().toISOString(), quiz_score: score }
          : p
      );
    } else {
      updated = [
        ...progress,
        {
          id: crypto.randomUUID(),
          module_day: day,
          completed: true,
          completed_at: new Date().toISOString(),
          quiz_score: score,
        },
      ];
    }
    saveProgress(updated);
    setProgress(updated);
  };

  const completedCount = progress.filter((p) => p.completed).length;
  const totalModules = 7;
  const overallProgress = Math.round((completedCount / totalModules) * 100);

  const getLevel = () => {
    if (completedCount >= 6) return "Avançado";
    if (completedCount >= 3) return "Intermediário";
    return "Iniciante";
  };

  const getStreak = () => {
    let streak = 0;
    const sorted = [...progress].filter((p) => p.completed).sort((a, b) => b.module_day - a.module_day);
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].module_day === completedCount - i) streak++;
      else break;
    }
    return streak;
  };

  return { progress, loading, isModuleUnlocked, getTimeUntilUnlock, completeModule, completedCount, totalModules, overallProgress, getLevel, getStreak };
}
