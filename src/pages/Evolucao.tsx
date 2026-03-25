import { motion } from "framer-motion";
import { Brain, Eye, Target, Calendar, Quote } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Progresso = () => {
  const stats = [
    { label: "Atenção", value: 85, color: "#7A00FF" },
    { label: "Raciocínio", value: 72, color: "#00F2FF" },
    { label: "Percepção", value: 94, color: "#FF00D9" },
    { label: "Consistência", value: 60, color: "#FF9900" },
  ];

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
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#FF00D9] mb-1 font-bold">Bio-Métricas</h2>
          <h1 className="text-3xl font-serif font-bold tracking-[0.1em]">Análise de Evolução</h1>
        </motion.div>
      </header>

      <main className="relative z-10 px-6 space-y-8">
        {/* IA Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] flex items-start gap-4"
        >
          <div className="p-2 bg-[#00F2FF]/10 rounded-lg">
            <Quote className="w-4 h-4 text-[#00F2FF]" />
          </div>
          <p className="text-xs text-white/60 leading-relaxed italic">
            "Sua percepção visual atingiu um novo patamar. O sistema detectou uma melhoria de 12% na velocidade de processamento de anomalias."
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl"
            >
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">{stat.label}</span>
                <span className="text-xl font-bold font-mono text-white">{stat.value}%</span>
              </div>
              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (i * 0.1) }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ 
                    backgroundColor: stat.color,
                    boxShadow: `0 0 15px ${stat.color}66`
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Radar/Summary Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="aspect-square w-full max-w-[280px] mx-auto relative flex items-center justify-center"
        >
          <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute inset-8 border border-white/5 rounded-full" />
          
          <Brain className="w-12 h-12 text-[#7A00FF] drop-shadow-[0_0_15px_rgba(122,0,255,0.5)]" />
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Progresso;
