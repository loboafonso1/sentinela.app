type ProgressItem = {
  id: string;
  module_day: number;
  completed: boolean;
  completed_at: string;
  quiz_score: number;
};

export function computeWeeklyFromProgress(progress: ProgressItem[], weekStart: Date) {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const map = new Map<string, number>();
  labels.forEach((l) => map.set(l, 0));

  progress
    .filter((p) => p.completed && p.completed_at)
    .forEach((p) => {
      const d = new Date(p.completed_at);
      if (Number.isNaN(d.getTime())) return;
      if (d < start || d >= end) return;

      const jsDay = d.getDay();
      const idx = jsDay === 0 ? 6 : jsDay - 1;
      const label = labels[idx];
      map.set(label, 100);
    });

  return labels.map((day) => ({ day, value: map.get(day) ?? 0 }));
}

