import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProximaEtapa = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Para efeito de teste, vamos apenas deixar o usuário aqui por enquanto
    // futuramente ele será redirecionado para o dashboard ou treino específico
    console.log("Bem-vindo à Próxima Etapa");
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0A0014] flex flex-col items-center justify-center overflow-hidden text-white font-sans">
      {/* Efeito de Ruído Digital Sutil */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Gradiente de Fundo (Mesmo estilo da tela anterior para consistência) */}
      <div className="absolute inset-0 bg-[#4C00B0] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#0A0014_0%,_transparent_70%)] z-1" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_#7A00FF_0%,_transparent_60%)] opacity-60 z-1" />
      <div className="absolute inset-0 bg-black/20 z-1" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-50 text-center px-6"
      >
        <h1 className="text-3xl font-serif font-bold tracking-[0.3em] uppercase mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Fase de Treinamento
        </h1>
        
        <div className="w-16 h-1 w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-[#00F2FF] to-transparent opacity-50 mb-12" />
        
        <p className="text-lg font-light tracking-[0.2em] text-white/80 max-w-md mx-auto leading-relaxed">
          Sua conexão foi estabelecida com sucesso. 
          <br /><br />
          <span className="text-white font-medium">Aguardando novos comandos do sistema...</span>
        </p>

        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mt-16 flex justify-center"
        >
          <div className="w-3 h-3 bg-[#00F2FF] rounded-full animate-ping" />
        </motion.div>

        <button
          onClick={() => navigate("/treinamento")}
          className="mt-20 group relative py-4 px-10 bg-white/5 border border-white/10 rounded-full transition-all hover:bg-white/10"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 group-hover:text-white transition-colors">
            Iniciar Treinamento
          </span>
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F2FF] to-transparent opacity-0 group-hover:opacity-50 transition-opacity" />
        </button>
      </motion.div>
    </div>
  );
};

export default ProximaEtapa;
