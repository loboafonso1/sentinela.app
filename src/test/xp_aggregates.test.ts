import { aggregates, addXpEvent, clearXpLog } from "@/hooks/useXpLog";

describe("XP aggregates", () => {
  beforeEach(() => {
    clearXpLog();
  });

  it("sums xp for day/week/month/year", () => {
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setHours(10, 0, 0, 0);
    monday.setDate(now.getDate() + diff);

    const base = new Date(monday);
    base.setDate(monday.getDate() + 2);

    addXpEvent(100, base);

    const other = new Date(monday);
    other.setDate(monday.getDate() + 1);
    addXpEvent(100, other);
    // previous month
    const prevMonth = new Date(base.getFullYear(), base.getMonth() - 1, 5, 12);
    addXpEvent(100, prevMonth);
    const agg = aggregates(base);
    expect(agg.dayTotal).toBeGreaterThanOrEqual(100);
    expect(agg.weekTotal).toBeGreaterThanOrEqual(200);
    expect(agg.monthTotal).toBeGreaterThanOrEqual(200);
    expect(agg.yearTotal).toBeGreaterThanOrEqual(300);
  });
});
