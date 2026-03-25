import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Play, Clock, Shield, Zap } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Treinamento = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState("14:22:05");

  return (
    <div className="min-h-screen bg-[#0A0014] text-white pb-32">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#4C00B0_0%,_transparent_50%)] opacity-20 z-0" />

      <header className="relative z-10 px-8 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#00F2FF] mb-1 font-bold">Módulo Ativo</h2>
          <h1 className="text-3xl font-serif font-bold tracking-[0.1em]">Centro de Treinamento</h1>
        </motion.div>
      </header>

      <main className="relative z-10 px-6 space-y-8">
        {/* Desafio Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent border border-white/5 backdrop-blur-xl p-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#7A00FF]/20 rounded-2xl border border-[#7A00FF]/30 shadow-[0_0_15px_rgba(122,0,255,0.3)]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
              <Zap className="w-3 h-3 text-[#00F2FF]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">+100 XP</span>
            </div>
          </div>

          <h3 className="text-xl font-bold tracking-[0.05em] mb-3">Análise de Padrões I</h3>
          <p className="text-sm text-white/50 leading-relaxed mb-8">
            Identifique anomalias visuais e distorções em cenários de alta complexidade. 
            Foco em percepção e velocidade de resposta.
          </p>

          <button 
            className="w-full py-5 bg-white text-black rounded-3xl font-bold tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 hover:bg-[#00F2FF] transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
          >
            <Play className="w-4 h-4 fill-current" />
            Iniciar Desafio
          </button>

          {/* Efeito de brilho na borda superior */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        {/* Próximos Desafios (Bloqueados) */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold px-2">Próximos Desafios</h4>
          
          {[
            { title: "Filtragem de Ruído", time: "24h 00m" },
            { title: "Sincronia Cognitiva", time: "48h 00m" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] opacity-60 grayscale"
            >
              <div className="flex items-center gap-5">
                <div className="p-3 bg-white/5 rounded-xl">
                  <Lock className="w-4 h-4 text-white/40" />
                </div>
                <div>
                  <h5 className="text-sm font-bold tracking-wide text-white/60">{item.title}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-white/20" />
                    <span className="text-[9px] uppercase tracking-[0.1em] text-white/30">Libera em {item.time}</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white/20 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Treinamento;
