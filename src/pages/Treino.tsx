import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Play, Clock, Shield, Zap, CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Treinamento = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("23:59:59");

  // Timer Simulado para o exemplo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = 23 - now.getHours();
      const m = 59 - now.getMinutes();
      const s = 59 - now.getSeconds();
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const desafios = [
    { name: "Análise de Padrões", status: "completado", time: null },
    { name: "Filtragem de Ruído", status: "bloqueado", time: "24h 00m" },
    { name: "Sincronia Cognitiva", status: "bloqueado", time: "48h 00m" },
    { name: "Leitura Comportamental", status: "bloqueado", time: "72h 00m" },
    { name: "Quebra de Narrativa", status: "bloqueado", time: "96h 00m" },
    { name: "Detecção de Anomalias", status: "bloqueado", time: "120h 00m" },
  ];

  const handleStartInvestigation = () => {
    // Transição com zoom para a tela de investigação (primeira aula)
    navigate("/analise-padroes");
  };

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
          <h2 className="text-[10px] uppercase tracking-[0.6em] text-[#00F2FF] mb-1 font-bold drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]">Centro de Operações</h2>
          <h1 className="text-3xl font-serif font-bold tracking-[0.1em]">Treinamento Elite</h1>
        </motion.div>
      </header>

      <main className="relative z-10 px-6 space-y-10">
        {/* Card Principal do Desafio do Dia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group rounded-[2.5rem] overflow-hidden bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl"
        >
          {/* Mockup Oval com Vídeo da IA */}
          <div className="relative h-72 w-full flex items-center justify-center pt-8 overflow-hidden">
            <div className="relative w-48 h-64 rounded-[100px] overflow-hidden border-2 border-[#7A00FF]/30 shadow-[0_0_30px_rgba(122,0,255,0.3)] bg-black">
              <video 
                src="/video/ia_avatar.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover scale-110 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 bg-[#7A00FF]/10 mix-blend-overlay" />
            </div>
            
            {/* Texto acima da imagem */}
            <div className="absolute top-6 left-8">
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/40 border-l-2 border-[#00F2FF] pl-3">Missão do Dia</span>
            </div>
          </div>

          <div className="px-8 pb-10 pt-6 relative z-10 text-center">
            <h3 className="text-lg font-bold tracking-[0.05em] mb-4 leading-relaxed text-white/90">
              "Responda rapidamente. <br />
              Não pense. <br />
              A primeira resposta… é sempre a mais honesta."
            </h3>
            
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-8">
              Módulo: Análise de Padrões I
            </p>

            <motion.button 
              onClick={handleStartInvestigation}
              animate={{ 
                boxShadow: ["0 0 20px rgba(122,0,255,0.2)", "0 0 40px rgba(122,0,255,0.4)", "0 0 20px rgba(122,0,255,0.2)"],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-full py-5 bg-gradient-to-r from-[#7A00FF] to-[#FF00D9] text-white rounded-3xl font-bold tracking-[0.3em] uppercase text-[10px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              Iniciar Investigação
            </motion.button>
          </div>

          {/* Brilho de Borda Superior */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        {/* Seção Próximos Desafios */}
        <div className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">Próximos Desafios</h4>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#00F2FF] opacity-60">
              <Clock className="w-3 h-3" />
              {timeLeft}
            </div>
          </div>
          
          <div className="space-y-3">
            {desafios.map((desafio, i) => (
              <motion.div
                key={desafio.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.05) }}
                className={`relative group flex items-center justify-between p-5 rounded-[1.8rem] border transition-all duration-500 ${
                  desafio.status === "completado" 
                    ? "bg-[#00FF94]/5 border-[#00FF94]/20" 
                    : "bg-white/[0.02] border-white/5 opacity-50 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl border ${
                    desafio.status === "completado" 
                      ? "bg-[#00FF94]/10 border-[#00FF94]/30" 
                      : "bg-white/5 border-white/10"
                  }`}>
                    {desafio.status === "completado" ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00FF94] drop-shadow-[0_0_8px_rgba(0,255,148,0.5)]" />
                    ) : (
                      <Lock className="w-4 h-4 text-white/20" />
                    )}
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold tracking-wider ${
                      desafio.status === "completado" ? "text-white" : "text-white/40"
                    }`}>
                      {desafio.name}
                    </h5>
                    {desafio.status === "completado" ? (
                      <span className="text-[8px] uppercase tracking-[0.2em] text-[#00FF94] font-bold mt-1 block drop-shadow-[0_0_5px_rgba(0,255,148,0.3)]">
                        Completado
                      </span>
                    ) : (
                      <span className="text-[8px] uppercase tracking-[0.1em] text-white/20 mt-1 block">
                        Libera em {desafio.time}
                      </span>
                    )}
                  </div>
                </div>

                {desafio.status === "bloqueado" && (
                   <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center">
                      <div className="w-1 h-1 bg-white/10 rounded-full" />
                   </div>
                )}
                
                {/* Efeito de brilho interativo para liberados (não aplicável aqui pois só temos 1 liberado, mas pronto para lógica) */}
                <div className="absolute inset-0 rounded-[1.8rem] bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Treinamento;
