import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, Clock, Eye, Lock, ScanFace, Sparkles, VenetianMask, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

type ChallengeId =
  | "analise_padroes"
  | "leitura_facial"
  | "detectar_mentiras"
  | "analise_intencoes"
  | "pressao_cognitiva"
  | "leitura_realidade";

type Challenge = {
  id: ChallengeId;
  name: string;
  description: string;
  impacts: string[];
  delayHours: number;
  icon: typeof Brain;
  accent: string;
  route?: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

const formatHms = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const Treinamento = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || "local";
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [baselineMs, setBaselineMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const key = `sentinela:training:baseline:${userId}`;
    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const n = Number(existing);
        if (Number.isFinite(n) && n > 0) {
          setBaselineMs(n);
          return;
        }
      }
    } catch {
      void 0;
    }

    const finishedAt = (() => {
      try {
        const raw = localStorage.getItem(`sentinela:analysis:lastMetrics:${userId}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const s = typeof parsed.finished_at === "string" ? parsed.finished_at : null;
        if (!s) return null;
        const d = new Date(s);
        if (Number.isNaN(d.getTime())) return null;
        return d.getTime();
      } catch {
        return null;
      }
    })();

    const nextBaseline = finishedAt ?? Date.now();
    setBaselineMs(nextBaseline);
    try {
      localStorage.setItem(key, String(nextBaseline));
    } catch {
      void 0;
    }
  }, [userId]);

  useEffect(() => {
    const t = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const desafios: Challenge[] = [
    {
      id: "analise_padroes",
      name: "Análise de Padrões",
      description: "Base do treinamento • leitura de sinais sob pressão",
      impacts: ["Atenção", "Precisão", "Consistência"],
      delayHours: 0,
      icon: Eye,
      accent: "#00E5FF",
      route: "/analise-padroes",
    },
    {
      id: "leitura_facial",
      name: "Leitura Facial Avançada",
      description: "Microexpressões e identificação emocional",
      impacts: ["Leitura facial", "Precisão", "Atenção"],
      delayHours: 24,
      icon: ScanFace,
      accent: "#00FF9C",
    },
    {
      id: "detectar_mentiras",
      name: "Detecção de Mentiras",
      description: "Comportamento e inconsistências",
      impacts: ["Detecção de mentira"],
      delayHours: 48,
      icon: VenetianMask,
      accent: "#FFC857",
    },
    {
      id: "analise_intencoes",
      name: "Análise de Intenções",
      description: "Contexto e intenção oculta",
      impacts: ["Detecção de mentira", "Precisão"],
      delayHours: 72,
      icon: Brain,
      accent: "#A855F7",
    },
    {
      id: "pressao_cognitiva",
      name: "Pressão Cognitiva",
      description: "Decisão rápida sob pressão",
      impacts: ["Atenção", "Precisão", "Consistência"],
      delayHours: 96,
      icon: Zap,
      accent: "#FF4D6D",
    },
    {
      id: "leitura_realidade",
      name: "Leitura Avançada de Realidade",
      description: "Padrões ocultos e manipulação complexa",
      impacts: ["Todas as métricas"],
      delayHours: 120,
      icon: Sparkles,
      accent: "#FFD700",
    },
  ];

  const desafiosView = desafios.map((d) => {
    const unlockAt = baselineMs + d.delayHours * 60 * 60 * 1000;
    const remaining = Math.max(0, unlockAt - nowMs);
    const unlocked = d.delayHours === 0 || remaining === 0;
    return { ...d, unlocked, remainingMs: remaining, unlockAt };
  });

  const nextUnlock = desafiosView
    .filter((d) => !d.unlocked)
    .sort((a, b) => a.unlockAt - b.unlockAt)[0];

  return (
    <div className="min-h-screen bg-[#0A0014] text-white pb-32">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#4C00B0_0%,_transparent_55%)] opacity-25 z-0" />

      <header className="relative z-10 px-8 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-[10px] uppercase tracking-[0.6em] text-[#00F2FF] mb-1 font-bold">Centro de Operações</h2>
          <h1 className="text-3xl font-serif font-bold tracking-[0.1em]">Treinamento Elite</h1>
        </motion.div>
      </header>

      <main className="relative z-10 px-6 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl"
        >
          <div className="relative w-full flex items-center justify-center pt-10 pb-6">
            <div className="absolute top-6 left-8">
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/40 border-l-2 border-[#00F2FF] pl-3">
                Missão do Dia
              </span>
            </div>

            <div className="relative w-52 h-72 rounded-[999px] overflow-hidden border-2 border-[#7A00FF]/30 shadow-[0_0_30px_rgba(122,0,255,0.3)] bg-black">
              <video src="/video/ia_avatar.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover scale-110 opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
              <div className="absolute inset-0 bg-[#7A00FF]/10 mix-blend-overlay" />
            </div>
          </div>

          <div className="px-8 pb-10 pt-2 text-center">
            <h3 className="text-lg font-bold tracking-[0.05em] mb-4 leading-relaxed text-white/90">
              "Responda rapidamente.
              <br />
              Não pense.
              <br />
              A primeira resposta… é sempre a mais honesta."
            </h3>

            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-8">Módulo: Análise de Padrões I</p>

            <motion.button
              onClick={() => navigate("/analise-padroes")}
              animate={{
                boxShadow: ["0 0 20px rgba(122,0,255,0.2)", "0 0 40px rgba(122,0,255,0.4)", "0 0 20px rgba(122,0,255,0.2)"],
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-full py-5 bg-gradient-to-r from-[#7A00FF] to-[#FF00D9] text-white rounded-3xl font-bold tracking-[0.3em] uppercase text-[10px] active:scale-[0.98] transition-all"
            >
              Iniciar Investigação
            </motion.button>
          </div>

          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        <div className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">Próximos Desafios</h4>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <Clock className="w-3 h-3" />
              <span className="text-[#FF4D6D]">{nextUnlock ? formatHms(nextUnlock.remainingMs) : "PRONTO"}</span>
            </div>
          </div>

          <div className="space-y-3">
            {desafiosView.map((d, idx) => (
              <motion.button
                key={d.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                whileTap={d.unlocked ? { scale: 0.985 } : undefined}
                whileHover={d.unlocked ? { scale: 1.01 } : undefined}
                onClick={() => {
                  if (!d.unlocked) return;
                  if (d.route) navigate(d.route);
                }}
                className={`w-full text-left flex items-center justify-between p-5 rounded-[1.8rem] border backdrop-blur-xl transition-all ${
                  d.unlocked ? "bg-white/[0.03]" : "bg-white/[0.02] opacity-70"
                }`}
                style={{
                  borderColor: hexToRgba(d.accent, d.unlocked ? 0.35 : 0.18),
                  boxShadow: d.unlocked
                    ? `0 0 26px ${hexToRgba(d.accent, 0.18)}, inset 0 1px 0 rgba(255,255,255,0.05)`
                    : `0 0 20px ${hexToRgba(d.accent, 0.08)}, inset 0 1px 0 rgba(255,255,255,0.03)`,
                }}
              >
                <div className="flex items-center gap-5">
                  <div
                    className="relative p-3 rounded-2xl border bg-black/35"
                    style={{
                      borderColor: hexToRgba(d.accent, d.unlocked ? 0.32 : 0.16),
                      boxShadow: d.unlocked ? `0 0 18px ${hexToRgba(d.accent, 0.28)}` : `0 0 14px ${hexToRgba(d.accent, 0.12)}`,
                    }}
                  >
                    <d.icon
                      className="w-5 h-5"
                      style={{
                        color: d.unlocked ? d.accent : "rgba(255,255,255,0.35)",
                        filter: d.unlocked ? `drop-shadow(0 0 10px ${hexToRgba(d.accent, 0.45)})` : "none",
                      }}
                    />
                    {!d.unlocked && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-white/35" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-bold tracking-wide ${d.unlocked ? "text-white/90" : "text-white/55"}`}>{d.name}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {d.unlocked ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" style={{ color: "#B7FFDE", filter: `drop-shadow(0 0 10px ${hexToRgba("#00FF9C", 0.5)})` }} />
                      <div className="text-[9px] uppercase tracking-[0.3em] font-bold" style={{ color: "#B7FFDE" }}>
                        Pronto
                      </div>
                    </div>
                  ) : (
                    <div className="text-[12px] font-mono text-[#FF4D6D]">{formatHms(d.remainingMs)}</div>
                  )}
                  {!d.unlocked && (
                    <div className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-bold">Libera em</div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Treinamento;
