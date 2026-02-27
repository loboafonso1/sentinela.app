import { aggregates, addXpEvent, clearXpLog } from "@/hooks/useXpLog";

describe("XP aggregates", () => {
  beforeEach(() => {
    clearXpLog();
  });

  it("sums xp for day/week/month/year", () => {
    const base = new Date();
    base.setHours(10, 0, 0, 0);
    // today
    addXpEvent(100, base);
    // this week other day
    const other = new Date(base); other.setDate(base.getDate() - 2);
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
