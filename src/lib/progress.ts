export type QuestionRecord = { attempts: number; firstTry: boolean; xpAwarded?: number };
export type DayRecord = { day: number; completedAt?: number | null; questions: QuestionRecord[]; xpEarned: number };
export type XpLogEntry = { ts: number; delta: number; userId?: string | null; dayId?: number; questionId?: number; attempts?: number };
export type ProgressStore = { version: 1; days: DayRecord[]; xpTotal: number; streak: number; lastCompletedDay?: number | null; lastCompletedAt?: number | null; xpLog?: XpLogEntry[] };

const KEY = "sentinela_progress_v1";
const TOTAL_DAYS = 30;

import { xpProfileForDay, computeXPForProfile } from "@/modules";

export function loadProgress(): ProgressStore {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { version: 1, days: [], xpTotal: 0, streak: 0, lastCompletedDay: null, lastCompletedAt: null, xpLog: [] };
    }
    try {
      const data = JSON.parse(raw) as ProgressStore;
      return data?.version === 1 ? data : { version: 1, days: [], xpTotal: 0, streak: 0, lastCompletedDay: null, lastCompletedAt: null, xpLog: [] };
    } catch {
      return { version: 1, days: [], xpTotal: 0, streak: 0, lastCompletedDay: null, lastCompletedAt: null, xpLog: [] };
    }
  } catch {
    return { version: 1, days: [], xpTotal: 0, streak: 0, lastCompletedDay: null, lastCompletedAt: null, xpLog: [] };
  }
}

export function saveProgress(store: ProgressStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch { void 0; }
}

function ensureDay(store: ProgressStore, day: number): DayRecord {
  let rec = store.days.find((d) => d.day === day);
  if (!rec) {
    rec = { day, questions: Array.from({ length: 3 }, () => ({ attempts: 0, firstTry: false })), xpEarned: 0, completedAt: null };
    store.days.push(rec);
  } else if (!rec.questions || rec.questions.length !== 3) {
    rec.questions = Array.from({ length: 3 }, (_, i) => rec!.questions?.[i] ?? { attempts: 0, firstTry: false });
  }
  return rec;
}

export function computeXP(attempts: number): number {
  const profile = xpProfileForDay(1);
  return computeXPForProfile(profile, attempts);
}

export function recordWrongAttempt(day: number, qIndex: number) {
  const s = loadProgress();
  const d = ensureDay(s, day);
  const q = d.questions[qIndex];
  q.attempts = (q.attempts || 0) + 1;
  saveProgress(s);
}

export function recordCorrectAttempt(day: number, qIndex: number) {
  const s = loadProgress();
  const d = ensureDay(s, day);
  const q = d.questions[qIndex];
  q.attempts = (q.attempts || 0) + 1;
  if (q.attempts === 1) q.firstTry = true;
  const profile = xpProfileForDay(day);
  const delta = computeXPForProfile(profile, q.attempts);
  if (!q.xpAwarded || q.xpAwarded === 0) {
    q.xpAwarded = delta;
    d.xpEarned += delta;
    s.xpTotal += delta;
    s.xpLog = s.xpLog || [];
    const userId = localStorage.getItem("sentinela_user_id") || null;
    s.xpLog.push({ ts: Date.now(), delta, userId, dayId: day, questionId: qIndex + 1, attempts: q.attempts });
  }
  saveProgress(s);
}

export function finalizeDayProgress(day: number) {
  const s = loadProgress();
  const d = ensureDay(s, day);
  if (!d.completedAt) {
    let delta = 15;
    const perfect = d.questions.every((q) => q.firstTry);
    if (perfect) delta += 10;
    d.xpEarned += delta;
    s.xpTotal += delta;
    s.xpLog = s.xpLog || [];
    s.xpLog.push({ ts: Date.now(), delta });
    d.completedAt = Date.now();
    if (!s.lastCompletedAt || isSameDay(new Date(s.lastCompletedAt), new Date(Date.now()))) {
      s.streak = (s.streak || 0) + 1;
    }
    s.lastCompletedDay = day;
    s.lastCompletedAt = d.completedAt;
    saveProgress(s);
  }
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function computeMetrics() {
  const s = loadProgress();
  const completedDays = s.days.filter((d) => !!d.completedAt).length;
  const allQuestions = s.days.flatMap((d) => d.questions || []);
  const attemptedQuestions = allQuestions.filter((q) => (q.attempts || 0) > 0);
  const firstTries = attemptedQuestions.filter((q) => q.firstTry).length;
  const attemptsSum = attemptedQuestions.reduce((acc, q) => acc + (q.attempts || 0), 0);
  const firstTryRate = attemptedQuestions.length ? firstTries / attemptedQuestions.length : 0;
  const avgAttempts = attemptedQuestions.length ? attemptsSum / attemptedQuestions.length : 0;
  const xpTotal = s.xpTotal || 0;
  const percent = Math.round(((completedDays || 0) / TOTAL_DAYS) * 100);
  const today = new Date();
  const todayXP = (s.xpLog || []).filter((e) => isSameDay(new Date(e.ts), today)).reduce((a, e) => a + e.delta, 0);
  const streak = s.streak || 0;
  const finalClass = classifyByXP(xpTotal);
  return { completedDays, firstTryRate, avgAttempts, xpTotal, percent, todayXP, streak, finalClass };
}

export function computeMindProfile(m: { firstTryRate: number; avgAttempts: number; completedDays: number }) {
  if (m.firstTryRate >= 0.8 && m.avgAttempts <= 1.4 && m.completedDays >= 10) {
    return {
      title: "Blindado",
      riskLevel: "Baixo",
      summary: "Alta precisão e consistência na análise de conteúdos.",
      recommendations: ["Mantenha sua rotina diária", "Compartilhe boas práticas com o grupo"],
    };
  }
  if (m.firstTryRate >= 0.6 && m.avgAttempts <= 1.8) {
    return {
      title: "Vigilante",
      riskLevel: "Médio",
      summary: "Bons sinais de discernimento com espaço para refinamento.",
      recommendations: ["Aprofunde revisões de textos-chave", "Mantenha foco e ritmo"],
    };
  }
  if (m.firstTryRate >= 0.4 && m.completedDays >= 5) {
    return {
      title: "Aprendiz em Fortalecimento",
      riskLevel: "Médio",
      summary: "Evolução consistente com base sólida em formação.",
      recommendations: ["Concentre-se em fundamentos", "Revise erros frequentes"],
    };
  }
  if (m.firstTryRate < 0.4 || m.avgAttempts > 2.2) {
    return {
      title: "Em Risco de Influência",
      riskLevel: "Alto",
      summary: "Indicadores apontam vulnerabilidades a narrativas incorretas.",
      recommendations: ["Redobre verificações bíblicas", "Evite fontes pouco confiáveis"],
    };
  }
  return {
    title: "Disperso",
    riskLevel: "Médio",
    summary: "Baixa constância e foco reduzido na jornada.",
    recommendations: ["Defina horário fixo de estudo", "Retome a sequência diária"],
  };
}

export function classifyByXP(total: number) {
  if (total >= 1800) return { label: "Mente Discernente", min: 1800, max: 2100 };
  if (total >= 1400) return { label: "Mente em Formação", min: 1400, max: 1799 };
  if (total >= 1000) return { label: "Mente Reativa", min: 1000, max: 1399 };
  return { label: "Mente Suscetível", min: 0, max: 999 };
}
