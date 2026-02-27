export type XpEvent = { ts: string; amount: number };

const STORAGE_KEY = "sentinela_xp_log";

export function getXpLog(): XpEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr: XpEvent[] = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addXpEvent(amount: number, date: Date = new Date()) {
  const log = getXpLog();
  log.push({ ts: date.toISOString(), amount });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export function clearXpLog() {
  localStorage.removeItem(STORAGE_KEY);
}

export type XpSeriesPoint = { name: string; xp: number };

export function aggregates(now: Date = new Date()) {
  const log = getXpLog();
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfDay); {
    const day = startOfWeek.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
  }
  const startOfMonth = new Date(startOfDay); startOfMonth.setDate(1);
  const startOfYear = new Date(startOfDay); startOfYear.setMonth(0, 1);

  const sum = (from: Date, to: Date) =>
    log.filter(e => {
      const d = new Date(e.ts);
      return d >= from && d < to;
    }).reduce((a, b) => a + (b.amount || 0), 0);

  const endOfDay = new Date(startOfDay); endOfDay.setDate(endOfDay.getDate() + 1);
  const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(endOfWeek.getDate() + 7);
  const endOfMonth = new Date(startOfMonth); endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  const endOfYear = new Date(startOfYear); endOfYear.setFullYear(endOfYear.getFullYear() + 1);

  // series
  const weekDays = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
  const weekSeries: XpSeriesPoint[] = Array.from({ length: 7 }).map((_, i) => {
    const from = new Date(startOfWeek); from.setDate(from.getDate() + i);
    const to = new Date(from); to.setDate(from.getDate() + 1);
    return { name: weekDays[i], xp: sum(from, to) };
  });

  const daysInMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).getDate();
  const monthSeries: XpSeriesPoint[] = Array.from({ length: daysInMonth }).map((_, i) => {
    const from = new Date(startOfMonth); from.setDate(1 + i);
    const to = new Date(from); to.setDate(from.getDate() + 1);
    return { name: String(i + 1), xp: sum(from, to) };
  });

  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const yearSeries: XpSeriesPoint[] = months.map((m, i) => {
    const from = new Date(startOfYear.getFullYear(), i, 1);
    const to = new Date(startOfYear.getFullYear(), i + 1, 1);
    return { name: m, xp: sum(from, to) };
  });

  const dayTotal = sum(startOfDay, endOfDay);
  const weekTotal = sum(startOfWeek, endOfWeek);
  const monthTotal = sum(startOfMonth, endOfMonth);
  const yearTotal = sum(startOfYear, endOfYear);

  return {
    dayTotal, weekTotal, monthTotal, yearTotal,
    daySeries: [{ name: "Hoje", xp: dayTotal }],
    weekSeries, monthSeries, yearSeries
  };
}
