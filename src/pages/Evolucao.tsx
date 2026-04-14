import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Quote, RotateCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

type MetricsPayload = {
  attention: number;
  reasoning: number;
  perception: number;
  consistency: number;
  flags?: { autoEdicao?: boolean; controleConsciente?: boolean };
};

const Progresso = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [localMetrics, setLocalMetrics] = useState<MetricsPayload | undefined>(undefined);
  const navMetrics = (location.state as { metrics?: MetricsPayload } | null)?.metrics;

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    try {
      const raw = localStorage.getItem(`sentinela:analysis:lastMetrics:${user.id}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const attention = typeof parsed.attention === "number" ? parsed.attention : undefined;
      const reasoning = typeof parsed.reasoning === "number" ? parsed.reasoning : undefined;
      const perception = typeof parsed.perception === "number" ? parsed.perception : undefined;
      const consistency = typeof parsed.consistency === "number" ? parsed.consistency : undefined;
      if (attention === undefined || reasoning === undefined || perception === undefined || consistency === undefined) return;
      const flagsRaw = parsed.flags;
      const flags =
        flagsRaw && typeof flagsRaw === "object"
          ? {
              autoEdicao: (flagsRaw as Record<string, unknown>).autoEdicao === true,
              controleConsciente: (flagsRaw as Record<string, unknown>).controleConsciente === true,
            }
          : undefined;
      setLocalMetrics({ attention, reasoning, perception, consistency, flags });
    } catch {
      void 0;
    }
  }, [user?.id]);

  const resolved = navMetrics || localMetrics;
  const stats = [
    { label: "Atenção", value: resolved?.attention ?? 0, color: "#7A00FF" },
    { label: "Raciocínio", value: resolved?.reasoning ?? 0, color: "#00F2FF" },
    { label: "Percepção", value: resolved?.perception ?? 0, color: "#FF00D9" },
    { label: "Consistência", value: resolved?.consistency ?? 0, color: "#FF9900" },
  ];

  const getDynamicPhrase = () => {
    const consistency = resolved?.consistency ?? 0;
    const flags = resolved?.flags || null;
    const autoEdicaoAtiva = !!flags && typeof flags === "object" && (flags as Record<string, unknown>).autoEdicao === true;
    if (autoEdicaoAtiva) return "Você não respondeu… você recalculou.";
    if (consistency > 90) return "Sua leitura comportamental apresenta estabilidade incomum.";
    if (consistency > 70) return "O sistema detectou ajustes no seu padrão de resposta.";
    if (consistency > 0) return "Seu comportamento indica adaptação ativa ao sistema.";
    return "Inicie a análise para gerar métricas de evolução.";
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
          onClick={() => navigate("/analise-padroes", { state: { fromRedo: true } })}
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="aspect-square w-full max-w-[280px] mx-auto relative flex items-center justify-center mt-8"
        >
          <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_20s_linear_infinite] opacity-30" />
          <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-30" />
          <div className="absolute inset-8 border border-white/5 rounded-full opacity-20" />
          <div className="relative p-8 bg-[#7A00FF]/5 rounded-full border border-[#7A00FF]/10 backdrop-blur-sm">
            <Brain className="w-12 h-12 text-[#7A00FF] drop-shadow-[0_0_20px_rgba(122,0,255,0.6)]" />
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Progresso;

