import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Zap, Trophy, TrendingUp } from "lucide-react";

const ResultadoAnalise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [xpCount, setXpCount] = useState(0);
  
  const targetXp = location.state?.xp || 0;

  useEffect(() => {
    if (!targetXp || targetXp <= 0) {
      setXpCount(0);
      return;
    }

    const duration = 2000;
    const stepTime = Math.max(10, Math.abs(Math.floor(duration / targetXp)));
    let currentXp = 0;

    const timer = setInterval(() => {
      currentXp += 5;
      if (currentXp >= targetXp) {
        setXpCount(targetXp);
        clearInterval(timer);
      } else {
        setXpCount(currentXp);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetXp]);

  useEffect(() => {
    if (!targetXp || targetXp <= 0) return;
    if (xpCount < targetXp) return;
    const t = setTimeout(() => navigate("/progresso"), 900);
    return () => clearTimeout(t);
  }, [navigate, targetXp, xpCount]);

  return (
    <div className="fixed inset-0 bg-[#0A0014] text-white flex flex-col items-center justify-center font-sans p-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#7A00FF_0%,_transparent_70%)] opacity-20 z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-50 text-center space-y-12"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="p-4 bg-[#7A00FF]/20 rounded-3xl border border-[#7A00FF]/30 shadow-[0_0_20px_rgba(122,0,255,0.3)]">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#00F2FF] font-bold">Análise Finalizada</h2>
              <h1 className="text-3xl font-serif font-bold tracking-[0.1em]">Processo Concluído</h1>
            </div>
          </motion.div>

          <p className="text-sm font-light tracking-[0.2em] leading-relaxed text-white/60 max-w-xs mx-auto">
            Seu padrão de resposta e tempo de reação foram catalogados pelo sistema.
          </p>
        </div>

        {/* XP Counter */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="w-48 h-48 rounded-full border-4 border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(122,0,255,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#7A00FF]/10 to-transparent" />
            <Zap className="w-6 h-6 text-[#00F2FF] mb-2 animate-pulse" />
            <span className="text-5xl font-mono font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {xpCount}
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 mt-1">XP Ganho</span>
          </motion.div>
          
          {/* Efeito de anel de carregamento circular */}
          <svg className="absolute top-0 left-0 w-48 h-48 -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="92"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-[#7A00FF]"
              strokeDasharray={578}
              strokeDashoffset={targetXp > 0 ? 578 - (578 * xpCount) / targetXp : 578}
            />
          </svg>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          onClick={() => navigate("/progresso")}
          className="w-full max-w-[280px] py-6 bg-white text-black rounded-[2rem] font-bold tracking-[0.4em] uppercase text-[11px] flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all mx-auto"
        >
          <Trophy className="w-4 h-4" />
          Ver Progresso
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ResultadoAnalise;
