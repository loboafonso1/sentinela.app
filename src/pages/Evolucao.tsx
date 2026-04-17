import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Quote, RotateCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

type MetricsPayload = {
  xp_gain?: number;
  attention?: number;
  reasoning?: number;
  perception?: number;
  consistency?: number;
  flags?: { autoEdicao?: boolean; controleConsciente?: boolean };
  finished_at?: string;
};

type AnswerRecord = {
  pergunta_id: number;
  resposta_escolhida: string;
  tempo_resposta_ms: number;
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

const levelDefs = [
  { level: 1, minXp: 0 },
  { level: 2, minXp: 900 },
  { level: 3, minXp: 2200 },
  { level: 4, minXp: 3800 },
  { level: 5, minXp: 6000 },
  { level: 6, minXp: 9000 },
];

const getLevelNumber = (xp: number) => {
  let current = levelDefs[0];
  for (const def of levelDefs) {
    if (xp >= def.minXp) current = def;
  }
  return current.level;
};

const messageForScore = (score: number, attention: number, consistency: number, lieDetection: number) => {
  if (score >= 85) return "Seu padrão indica alta resistência à manipulação.";
  if (score >= 75) return "Seu nível de análise está acima da média.";
  if (score >= 67) return "Você está evoluindo rapidamente na leitura de padrões.";
  if (score >= 58) return "Você demonstra boa leitura comportamental, mas ainda perde sinais sutis.";
  if (score >= 50) return "Seu comportamento indica atenção moderada a detalhes.";
  if (attention < 40) return "Seu tempo de resposta compromete sua precisão.";
  if (consistency < 45) return "Sua análise é inconsistente em cenários ambíguos.";
  if (lieDetection < 40) return "Você demonstra dificuldade em identificar intenções ocultas.";
  if (score >= 40) return "Você ainda apresenta vulnerabilidade a enganos simples.";
  return "Seu desempenho atual indica baixa leitura comportamental.";
};

const shortenForLevel = (msg: string, level: number) => {
  if (level > 2) return msg;
  const comma = msg.indexOf(",");
  if (comma > 0) return `${msg.slice(0, comma)}.`;
  return msg;
};

const interpretationFor = (attention: number, precision: number, facialReading: number, lieDetection: number, consistency: number) => {
  if (attention < 45 && precision < 55) return "Seu tempo de resposta compromete decisões críticas.";
  if (precision < 50 && lieDetection < 50) return "Você percebe o cenário, mas erra na interpretação.";
  if (consistency < 50) return "Seu padrão oscila sob ambiguidade e perde estabilidade.";
  if (facialReading < 45 && lieDetection >= 60) return "Boa leitura de cenário, mas sinais faciais ainda passam despercebidos.";
  if (attention >= 70 && precision < 60) return "Você é rápido, mas ainda impreciso sob pressão.";
  if (precision >= 75 && consistency >= 75) return "Seu desempenho é estável e acima da média.";
  return "Você possui boa capacidade analítica, mas ainda falha sob pressão.";
};

const brainColorFor = (score: number) => {
  if (score >= 90) return "#FFD700";
  if (score >= 75) return "#A855F7";
  if (score >= 55) return "#00E5FF";
  if (score >= 35) return "#FFC857";
  return "#FF4D6D";
};

const Progresso = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [localMetrics, setLocalMetrics] = useState<MetricsPayload | undefined>(undefined);
  const [localAttempt, setLocalAttempt] = useState<AnswerRecord[] | undefined>(undefined);
  const [xpTotal, setXpTotal] = useState(0);
  const navMetrics = (location.state as { metrics?: MetricsPayload } | null)?.metrics;

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    try {
      const raw = localStorage.getItem(`sentinela:analysis:lastMetrics:${user.id}`);
      if (!raw) return;
      const parsed = parseJson<Record<string, unknown>>(raw);
      if (!parsed) return;
      const xp_gain = typeof parsed.xp_gain === "number" ? parsed.xp_gain : undefined;
      const attention = typeof parsed.attention === "number" ? parsed.attention : undefined;
      const reasoning = typeof parsed.reasoning === "number" ? parsed.reasoning : undefined;
      const perception = typeof parsed.perception === "number" ? parsed.perception : undefined;
      const consistency = typeof parsed.consistency === "number" ? parsed.consistency : undefined;
      const finished_at = typeof parsed.finished_at === "string" ? parsed.finished_at : undefined;
      const flagsRaw = parsed.flags;
      const flags =
        flagsRaw && typeof flagsRaw === "object"
          ? {
              autoEdicao: (flagsRaw as Record<string, unknown>).autoEdicao === true,
              controleConsciente: (flagsRaw as Record<string, unknown>).controleConsciente === true,
            }
          : undefined;
      setLocalMetrics({ xp_gain, attention, reasoning, perception, consistency, flags, finished_at });
    } catch {
      void 0;
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const attempt = parseJson<AnswerRecord[]>(localStorage.getItem(`sentinela:analysis:lastAttempt:${user.id}`));
    setLocalAttempt(Array.isArray(attempt) ? attempt : undefined);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const xpRaw = localStorage.getItem(`sentinela:xp:${user.id}`) || "0";
    const xp = Number(xpRaw) || 0;
    setXpTotal(xp);
  }, [user?.id]);

  const resolved = navMetrics || localMetrics;

  const derived = useMemo(() => {
    const attempt = localAttempt || null;
    const consistencyRaw = resolved?.consistency ?? 0;
    const perceptionRaw = resolved?.perception ?? 0;

    let avgMs = 0;
    if (attempt && attempt.length) {
      avgMs = attempt.reduce((acc, a) => acc + (Number(a.tempo_resposta_ms) || 0), 0) / attempt.length;
    }

    const attention = clamp(Math.round(100 - (avgMs / 6000) * 100), 0, 100);
    const lieDetection = clamp(Math.round(0.75 * perceptionRaw + 0.25 * consistencyRaw), 0, 100);
    const facialReadingRaw = Number(localStorage.getItem(`sentinela:facial:lastScore:${user?.id}`) || "0") || 0;
    const facialReading = clamp(Math.round(facialReadingRaw), 0, 100);

    let precision = clamp(Math.round(0.45 * attention + 0.35 * consistencyRaw + 0.2 * lieDetection), 0, 100);
    const redoCount = Number(localStorage.getItem(`sentinela:analysis:redoCount:${user?.id}`) || "0") || 0;
    if (redoCount > 0) precision = clamp(Math.round(precision * Math.pow(0.9, redoCount)), 0, 100);

    const consistency = clamp(Math.round(consistencyRaw), 0, 100);
    const score = clamp(Math.round((attention + precision + facialReading + lieDetection + consistency) / 5), 0, 100);

    const level = getLevelNumber(xpTotal);
    const msg = shortenForLevel(messageForScore(score, attention, consistency, lieDetection), level);
    const interpretation = shortenForLevel(interpretationFor(attention, precision, facialReading, lieDetection, consistency), level);
    const brainColor = brainColorFor(score);

    return { attention, precision, facialReading, lieDetection, consistency, score, msg, interpretation, brainColor };
  }, [localAttempt, resolved?.consistency, resolved?.perception, user?.id, xpTotal]);

  const stats = [
    { label: "Atenção", value: derived.attention, color: "#00E5FF" },
    { label: "Precisão", value: derived.precision, color: "#00FF9C" },
    { label: "Leitura facial", value: derived.facialReading, color: "#A855F7" },
    { label: "Detecção de mentira", value: derived.lieDetection, color: "#FFC857" },
    { label: "Consistência", value: derived.consistency, color: "#FF4D6D" },
  ];

  const getDynamicPhrase = () => {
    const flags = resolved?.flags || null;
    const autoEdicaoAtiva = !!flags && typeof flags === "object" && (flags as Record<string, unknown>).autoEdicao === true;
    if (autoEdicaoAtiva) return "Sua análise foi recalculada.";
    if (!resolved) return "Inicie a análise para gerar métricas de evolução.";
    return derived.msg;
  };

  return (
    <div className="min-h-screen bg-[#0A0014] text-white pb-32">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#4C00B0_0%,_transparent_50%)] opacity-20 z-0" />

      <header className="relative z-10 px-8 pt-12 pb-6 flex justify-between items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#FF00D9] mb-1 font-bold">Bio-Métricas</h2>
          <h1 className="text-3xl font-serif font-bold tracking-[0.1em]">Análise de Evolução</h1>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            try {
              if (user?.id) localStorage.setItem(`sentinela:analysis:redoPending:${user.id}`, "1");
            } catch {
              void 0;
            }
            navigate("/analise-padroes", { state: { fromRedo: true } });
          }}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 group transition-all"
        >
          <RotateCcw className="w-4 h-4 text-white/40 group-hover:text-[#00F2FF] transition-colors" />
          <span className="text-[8px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors font-bold">
            Refazer Análise
          </span>
        </motion.button>
      </header>

      <main className="relative z-10 px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] flex items-start gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        >
          <div className="p-2 bg-[#00F2FF]/10 rounded-lg shrink-0">
            <Quote className="w-4 h-4 text-[#00F2FF]" />
          </div>
          <p className="text-xs text-white/80 leading-relaxed italic font-medium">"{getDynamicPhrase()}"</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm"
            >
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">{stat.label}</span>
                <span className="text-xl font-bold font-mono text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {loading ? "--" : `${Math.round(stat.value)}%`}
                </span>
              </div>
              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(100, stat.value))}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.45 + i * 0.08 }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: stat.color, boxShadow: `0 0 15px ${stat.color}66` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        >
          <div className="text-[10px] uppercase tracking-[0.5em] text-white/35 font-bold">INTERPRETAÇÃO</div>
          <div className="mt-3 text-sm text-white/80 leading-relaxed">{derived.interpretation}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="aspect-square w-full max-w-[280px] mx-auto relative flex items-center justify-center mt-8"
        >
          <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_20s_linear_infinite] opacity-30" />
          <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-30" />
          <div className="absolute inset-8 border border-white/5 rounded-full opacity-20" />
          <div
            className="relative p-8 rounded-full border backdrop-blur-sm"
            style={{
              background: `${derived.brainColor}12`,
              borderColor: `${derived.brainColor}33`,
              boxShadow: `0 0 40px ${derived.brainColor}22`,
            }}
          >
            <Brain className="w-12 h-12" style={{ color: derived.brainColor, filter: `drop-shadow(0 0 22px ${derived.brainColor}99)` }} />
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Progresso;
