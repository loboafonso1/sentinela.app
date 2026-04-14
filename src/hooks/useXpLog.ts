type XpEvent = {
  xp: number;
  at: string;
};

const STORAGE_KEY = "sentinela:xpLog";
let memory: XpEvent[] = [];

const load = () => {
  if (memory.length) return memory;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return memory;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return memory;
    memory = parsed
      .filter((v) => v && typeof v === "object")
      .map((v) => {
        const r = v as Record<string, unknown>;
        return {
          xp: typeof r.xp === "number" ? r.xp : 0,
          at: typeof r.at === "string" ? r.at : new Date().toISOString(),
        };
      })
      .filter((e) => e.xp > 0);
    return memory;
  } catch {
    return memory;
  }
};

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    void 0;
  }
};

export function clearXpLog() {
  memory = [];
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    void 0;
  }
}

export function addXpEvent(xp: number, at: Date = new Date()) {
  load();
  memory.unshift({ xp, at: at.toISOString() });
  persist();
}

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const startOfWeekMonday = (d: Date) => {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  return x;
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
const startOfYear = (d: Date) => new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);

export function aggregates(base: Date = new Date()) {
  load();

  const dayStart = startOfDay(base);
  const weekStart = startOfWeekMonday(base);
  const monthStart = startOfMonth(base);
  const yearStart = startOfYear(base);

  let dayTotal = 0;
  let weekTotal = 0;
  let monthTotal = 0;
  let yearTotal = 0;

  memory.forEach((e) => {
    const d = new Date(e.at);
    if (Number.isNaN(d.getTime())) return;
    if (d >= yearStart) yearTotal += e.xp;
    if (d >= monthStart) monthTotal += e.xp;
    if (d >= weekStart) weekTotal += e.xp;
    if (d >= dayStart) dayTotal += e.xp;
  });

  return { dayTotal, weekTotal, monthTotal, yearTotal };
}

