import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Lock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Treinamento = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("23:59:59");

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      const h = 23 - now.getHours();
      const m = 59 - now.getMinutes();
      const s = 59 - now.getSeconds();
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const desafios = [
    { name: "Análise de Padrões", status: "liberado" as const },
    { name: "Filtragem de Ruído", status: "bloqueado" as const, time: "24h" },
    { name: "Sincronia Cognitiva", status: "bloqueado" as const, time: "48h" },
    { name: "Leitura Comportamental", status: "bloqueado" as const, time: "72h" },
    { name: "Quebra de Narrativa", status: "bloqueado" as const, time: "96h" },
    { name: "Detecção de Anomalias", status: "bloqueado" as const, time: "120h" },
  ];

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
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#00F2FF] opacity-60">
              <Clock className="w-3 h-3" />
              {timeLeft}
            </div>
          </div>

          <div className="space-y-3">
            {desafios.map((d, idx) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className={`flex items-center justify-between p-5 rounded-[1.8rem] border backdrop-blur-sm ${
                  d.status === "liberado"
                    ? "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] transition-colors"
                    : "bg-white/[0.02] border-white/5 opacity-55 blur-[0.3px]"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl border ${d.status === "liberado" ? "bg-white/5 border-white/10" : "bg-white/5 border-white/10"}`}>
                    {d.status === "liberado" ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00FF94] drop-shadow-[0_0_8px_rgba(0,255,148,0.5)]" />
                    ) : (
                      <Lock className="w-4 h-4 text-white/20" />
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-bold tracking-wider ${d.status === "liberado" ? "text-white/85" : "text-white/40"}`}>
                      {d.name}
                    </div>
                    {d.status === "bloqueado" ? (
                      <div className="text-[8px] uppercase tracking-[0.15em] text-white/20 mt-1">Libera em {d.time}</div>
                    ) : (
                      <div className="text-[8px] uppercase tracking-[0.2em] text-[#00FF94] font-bold mt-1 drop-shadow-[0_0_5px_rgba(0,255,148,0.3)]">
                        Liberado
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                </div>
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

