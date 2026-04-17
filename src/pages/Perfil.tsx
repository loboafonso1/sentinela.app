import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, BarChart3, ChevronRight, Crown, LogOut, Shield, Timer, User } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

type MetricsPayload = {
  xp_gain?: number;
  attention: number;
  reasoning: number;
  perception: number;
  consistency: number;
  flags?: { autoEdicao?: boolean; controleConsciente?: boolean };
  finished_at?: string;
};

type AnswerRecord = {
  pergunta_id: number;
  resposta_escolhida: string;
  tempo_resposta_ms: number;
};

type LeaderboardEntry = {
  id: string;
  email: string;
  xp: number;
  updatedAt: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const parseJson = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const isSameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

const msToHoursCeil = (ms: number) => Math.max(0, Math.ceil(ms / (60 * 60 * 1000)));

const levelDefs = [
  { level: 1, name: "INICIANTE", minXp: 0 },
  { level: 2, name: "OBSERVADOR", minXp: 900 },
  { level: 3, name: "ANALISTA", minXp: 2200 },
  { level: 4, name: "INVESTIGADOR", minXp: 3800 },
  { level: 5, name: "ELITE", minXp: 6000 },
  { level: 6, name: "SENTINELA", minXp: 9000 },
];

const getLevelInfo = (xp: number) => {
  const sorted = [...levelDefs].sort((a, b) => a.minXp - b.minXp);
  let current = sorted[0];
  for (const def of sorted) {
    if (xp >= def.minXp) current = def;
  }
  const currentIndex = sorted.findIndex((d) => d.level === current.level);
  const next = currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;
  const currentMin = current.minXp;
  const nextMin = next?.minXp ?? current.minXp + 2500;
  const progress = nextMin > currentMin ? clamp((xp - currentMin) / (nextMin - currentMin), 0, 1) : 1;
  const remainingPercent = Math.round((1 - progress) * 100);
  return { current, next, progress, remainingPercent, nextMin };
};

const Perfil = () => {
  const { user, signOut } = useAuth();
  const [levelName, setLevelName] = useState("INICIANTE");
  const [xpTotal, setXpTotal] = useState(0);
  const [metrics, setMetrics] = useState<MetricsPayload | null>(null);
  const [attempt, setAttempt] = useState<AnswerRecord[] | null>(null);
  const [rankLabel, setRankLabel] = useState<string>("TOP 99%");
  const [missionsTodayDone, setMissionsTodayDone] = useState(0);
  const [nextInHours, setNextInHours] = useState<number | null>(null);

  useEffect(() => {
    try {
      const id = user?.id;
      const byUser = id ? localStorage.getItem(`sentinela:user_level_name:${id}`) : null;
      const fallback = localStorage.getItem("user_level_name");
      setLevelName((byUser || fallback || "INICIANTE").toUpperCase());
    } catch {
      setLevelName("INICIANTE");
    }
  }, [user?.id]);

  useEffect(() => {
    const id = user?.id;
    if (!id) return;
    try {
      const xpRaw = localStorage.getItem(`sentinela:xp:${id}`) || "0";
      const xp = Number(xpRaw) || 0;
      setXpTotal(xp);

      const lastMetrics = parseJson<MetricsPayload>(localStorage.getItem(`sentinela:analysis:lastMetrics:${id}`));
      setMetrics(lastMetrics);

      const lastAttempt = parseJson<AnswerRecord[]>(localStorage.getItem(`sentinela:analysis:lastAttempt:${id}`));
      setAttempt(Array.isArray(lastAttempt) ? lastAttempt : null);

      const finishedAt = lastMetrics?.finished_at ? new Date(lastMetrics.finished_at) : null;
      const doneToday = finishedAt ? (isSameDay(finishedAt, new Date()) ? 1 : 0) : 0;
      setMissionsTodayDone(doneToday);

      if (doneToday) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        setNextInHours(msToHoursCeil(tomorrow.getTime() - now.getTime()));
      } else {
        setNextInHours(null);
      }

      const key = "sentinela:leaderboard:v1";
      const board = parseJson<LeaderboardEntry[]>(localStorage.getItem(key)) || [];
      const email = user?.email || "usuario@sentinela.local";
      const nowIso = new Date().toISOString();
      const nextBoard = [
        { id, email, xp, updatedAt: nowIso },
        ...board.filter((e) => e && typeof e === "object" && e.id !== id && typeof e.id === "string"),
      ]
        .map((e) => ({
          id: e.id,
          email: typeof e.email === "string" ? e.email : "usuario@sentinela.local",
          xp: typeof e.xp === "number" ? e.xp : Number(e.xp) || 0,
          updatedAt: typeof e.updatedAt === "string" ? e.updatedAt : nowIso,
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 500);
      localStorage.setItem(key, JSON.stringify(nextBoard));

      const rank = Math.max(1, nextBoard.findIndex((e) => e.id === id) + 1);
      const count = nextBoard.length;
      if (count >= 50) {
        setRankLabel(`RANK GLOBAL #${rank.toString().padStart(4, "0")}`);
      } else {
        const topPercent = clamp(Math.round((rank / Math.max(1, count)) * 100), 1, 99);
        setRankLabel(`TOP ${topPercent}%`);
      }
    } catch {
      setXpTotal(0);
      setMetrics(null);
      setAttempt(null);
      setRankLabel("TOP 99%");
      setMissionsTodayDone(0);
      setNextInHours(null);
    }
  }, [user?.email, user?.id]);

  const levelInfo = useMemo(() => getLevelInfo(xpTotal), [xpTotal]);

  const statusMental = useMemo(() => {
    const attention = metrics?.attention ?? 0;
    const consistency = metrics?.consistency ?? 0;
    const perception = metrics?.perception ?? 0;

    let avgMs = 0;
    if (attempt && attempt.length) {
      avgMs = attempt.reduce((acc, a) => acc + (Number(a.tempo_resposta_ms) || 0), 0) / attempt.length;
    }
    const speed = clamp(Math.round(100 - (avgMs / 6000) * 100), 0, 100);
    const precision = clamp(Math.round((attention + perception) / 2), 0, 100);
    return {
      precision,
      speed,
      consistency: clamp(Math.round(consistency), 0, 100),
    };
  }, [attempt, metrics?.attention, metrics?.consistency, metrics?.perception]);

  return (
    <div className="min-h-screen bg-[#0A0014] text-white pb-32">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(122,0,255,0.35)_0%,_transparent_55%)] opacity-25 z-0" />

      <header className="relative z-10 px-8 pt-12 pb-12 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative mb-6">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#7A00FF]/40 to-[#FF00D9]/25 blur-xl" />
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#7A00FF] to-[#FF00D9] p-[2px] shadow-[0_0_40px_rgba(122,0,255,0.25)]">
            <div className="w-full h-full rounded-full bg-[#0A0014] flex items-center justify-center overflow-hidden border border-white/5">
              <User className="w-12 h-12 text-white/20" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 p-2.5 bg-black/50 border border-white/10 backdrop-blur-xl rounded-2xl shadow-[0_0_18px_rgba(0,229,255,0.25)]">
            <Shield className="w-4 h-4 text-[#00E5FF]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold tracking-tight mb-1 max-w-[320px] truncate"
        >
          {user?.email?.split("@")[0] || "Agente Sentinela"}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="text-center space-y-4 w-full max-w-md">
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/55 font-bold truncate">
            NÍVEL {levelInfo.current.level} • {levelName}
          </div>

          <div className="w-full rounded-full bg-white/10 overflow-hidden h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(levelInfo.progress * 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] via-[#A855F7] to-[#FF00D9]"
              style={{ boxShadow: "0 0 18px rgba(168,85,247,0.35)" }}
            />
          </div>

          <div className="text-[10px] uppercase tracking-[0.28em] text-white/35 font-bold">
            {levelInfo.remainingPercent}% para o próximo nível
          </div>
        </motion.div>
      </header>

      <main className="relative z-10 px-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(0,229,255,0.10)_0%,_transparent_55%)]" />
            <div className="relative">
              <div className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-bold">MISSÕES HOJE</div>
              <div className="mt-3 text-sm font-semibold text-white/85">
                ✔ {missionsTodayDone} concluída{missionsTodayDone === 1 ? "" : "s"}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/35 font-bold flex items-center gap-2">
                <Timer className="w-3 h-3 text-white/35" />
                {missionsTodayDone === 1 && nextInHours !== null ? `Próxima em: ${nextInHours}h` : "Disponível agora"}
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,200,87,0.10)_0%,_transparent_55%)]" />
            <div className="relative">
              <div className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-bold">RANKING</div>
              <div className="mt-3 text-sm font-semibold text-white/85 flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#FFC857]" />
                {rankLabel}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/35 font-bold">
                XP {xpTotal}
              </div>
            </div>
          </div>
        </div>

          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,_rgba(168,85,247,0.14)_0%,_transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xl">
                  <BarChart3 className="w-4 h-4 text-[#A855F7]" />
                </div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-white/45 font-bold">STATUS MENTAL</div>
              </div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/25 font-bold">
                {metrics ? "Ativo" : "Sem dados"}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Precisão", value: statusMental.precision, color: "#00E5FF" },
                { label: "Velocidade", value: statusMental.speed, color: "#00FF9C" },
                { label: "Consistência", value: statusMental.consistency, color: "#FFC857" },
              ].map((m) => (
                <div key={m.label} className="rounded-3xl bg-black/25 border border-white/10 backdrop-blur-xl p-4 min-w-0">
                  <div className="text-[8px] uppercase tracking-[0.18em] text-white/40 font-bold truncate">{m.label}</div>
                  <div className="mt-2 text-[18px] font-bold font-mono truncate" style={{ color: m.color }}>
                    {m.value}%
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${m.value}%`, backgroundColor: m.color, boxShadow: `0 0 14px ${m.color}55` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: "Conquistas", icon: Award },
            { label: "Histórico de Análise", icon: Shield },
          ].map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all"
              style={{ boxShadow: "0 0 24px rgba(122,0,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xl">
                  <item.icon className="w-5 h-5 text-white/65" />
                </div>
                <span className="text-sm font-bold text-white/90 tracking-wide">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </motion.button>
          ))}

          <motion.button
            onClick={() => signOut()}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all mt-8"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xl">
                <LogOut className="w-5 h-5 text-white/60" />
              </div>
              <span className="text-sm font-bold text-white/70">Encerrar Sessão</span>
            </div>
          </motion.button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Perfil;
