import { computeWeeklyFromProgress } from "@/hooks/useWeeklyFromProgress";

describe("computeWeeklyFromProgress", () => {
  it("maps completed_at within the current week to 100", () => {
    const monday = new Date();
    const day = monday.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    monday.setDate(monday.getDate() + diff);
    monday.setHours(12, 0, 0, 0);

    const wed = new Date(monday); wed.setDate(monday.getDate() + 2);
    const fri = new Date(monday); fri.setDate(monday.getDate() + 4);

    const progress = [
      { id: "1", module_day: 1, completed: true, completed_at: wed.toISOString(), quiz_score: 2 },
      { id: "2", module_day: 2, completed: true, completed_at: fri.toISOString(), quiz_score: 3 },
    ] as { id: string; module_day: number; completed: boolean; completed_at: string; quiz_score: number }[];
    const res = computeWeeklyFromProgress(progress, monday);
    const map = Object.fromEntries(res.map(d => [d.day, d.value]));
    expect(map["Qua"]).toBe(100);
    expect(map["Sex"]).toBe(100);
  });
});
