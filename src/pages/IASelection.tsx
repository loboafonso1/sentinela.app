import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const IASelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showButtons, setShowButtons] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const loadingPhrases = [
    "Iniciando interface",
    "Verificando padrões",
    "Sincronizando dados",
    "Conexão quase estabelecida"
  ];

  const levels = [
    { id: "iniciante", label: "Iniciante", audio: "/audio/ia_resposta_iniciante.mp3", color: "from-blue-600/20 to-blue-900/40", borderColor: "border-blue-500/30" },
    { id: "observador", label: "Observador", audio: "/audio/ia_resposta_observador.mp3", color: "from-emerald-600/20 to-emerald-900/40", borderColor: "border-emerald-500/30" },
    { id: "analista", label: "Analista", audio: "/audio/ia_resposta_analista.mp3", color: "from-amber-600/20 to-amber-900/40", borderColor: "border-amber-500/30" },
    { id: "investigador", label: "Investigador", audio: "/audio/ia_resposta_investigador.mp3", color: "from-purple-600/20 to-purple-900/40", borderColor: "border-purple-500/30" },
    { id: "especialista", label: "Especialista", audio: "/audio/ia_resposta_especialista.mp3", color: "from-rose-600/20 to-rose-900/40", borderColor: "border-rose-500/30" },
  ];

  useEffect(() => {
    if (!hasStarted) {
      const interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hasStarted]);

  const handleStart = async () => {
    setIsConnecting(true);
    
    // Pequeno delay para mostrar o estado "Conectando" antes da transição
    setTimeout(async () => {
      setHasStarted(true);
      
      if (videoRef.current) {
        try {
          videoRef.current.muted = false;
          videoRef.current.currentTime = 0;
          videoRef.current.loop = false;
          
          videoRef.current.onended = () => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.loop = true;
              videoRef.current.play().catch(e => console.warn("Erro ao reiniciar loop:", e));
            }
            setIsPlaying(false);
            setShowButtons(true);
          };

          await videoRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.warn("Erro ao iniciar vídeo:", e);
          setShowButtons(true);
        }
      }
    }, 800);
  };

  const handleLevelSelect = async (level: typeof levels[0]) => {
    if (selectedLevel) return;
    
    setSelectedLevel(level.id);
    setShowButtons(false);
    
    if (user) {
      await supabase
        .from("profiles")
        .update({ user_level_name: level.label })
        .eq("id", user.id);
    }

    setTimeout(async () => {
      const responseAudio = new Audio(level.audio);
      audioRef.current = responseAudio;
      
      try {
        await responseAudio.play();
        setIsPlaying(true);
        
        responseAudio.onended = () => {
          setIsPlaying(false);
          navigate("/proxima-etapa"); 
        };
      } catch (e) {
        navigate("/proxima-etapa");
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden text-white font-sans selection:bg-white/10">
      {/* Efeito de Ruído Digital Sutil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Gradiente Escuro de Fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0A0A] to-[#121212] z-0" />

      {!hasStarted ? (
        <div className="z-50 flex flex-col items-center justify-between h-full py-20 px-6 w-full max-w-lg">
          {/* Título Superior */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.4, 0.6, 0.4],
              scale: [0.98, 1, 0.98]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-center"
          >
            <h2 className="text-sm font-light tracking-[0.5em] uppercase text-white/60 mb-1">Interface</h2>
            <h1 className="text-3xl font-serif font-bold tracking-[0.3em] uppercase bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">Sentinela</h1>
          </motion.div>

          {/* Frases de Inicialização Centrais */}
          <div className="flex flex-col items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={loadingPhraseIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1 }}
                className="text-center"
              >
                <p className="text-lg font-light tracking-[0.15em] text-white/80">
                  {loadingPhrases[loadingPhraseIndex]}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block ml-1 w-1 h-5 bg-white/40 align-middle"
                  />
                </p>
              </motion.div>
            </AnimatePresence>
            
            <motion.p 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-2"
            >
              Aguardando Ativação
            </motion.p>
          </div>
          
          {/* Botão de Início */}
          <div className="w-full">
            <button
              onClick={handleStart}
              disabled={isConnecting}
              className="group relative w-full py-6 bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:border-white/20 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              <AnimatePresence mode="wait">
                {!isConnecting ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <span className="text-sm font-bold tracking-[0.3em] uppercase text-white/90 group-hover:text-white transition-colors">Iniciar Conexão</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="connecting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-sm font-bold tracking-[0.3em] uppercase text-white">Conectando</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Efeito de Brilho Lateral (Glow) */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative w-full h-full"
        >
          {/* Indicador de carregamento caso o vídeo demore */}
          {!videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-0 bg-black">
              <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
            </div>
          )}

          {/* Avatar IA em loop */}
          <div className="relative w-full h-full flex items-center justify-center z-10">
            <motion.div
              animate={isPlaying ? {
                scale: [1, 1.03, 1],
              } : {
                scale: 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <video
                ref={videoRef}
                src="/video/ia_avatar.mp4"
                autoPlay
                playsInline
                className={`min-w-full min-h-full object-cover pointer-events-none transition-opacity duration-1500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                onCanPlay={() => {
                  setVideoLoaded(true);
                }}
                onEnded={() => {
                  console.log("Vídeo finalizado (inline) - disparando transição");
                  if (videoRef.current) {
                    videoRef.current.muted = true;
                    videoRef.current.loop = true;
                    videoRef.current.play().catch(e => console.warn("Erro ao reiniciar loop:", e));
                  }
                  setIsPlaying(false);
                  setShowButtons(true);
                }}
                onError={(e) => {
                  console.error("Erro no vídeo (tentando /video/ia_avatar.mp4):", e);
                  setShowButtons(true);
                }}
              />
            </motion.div>
          </div>

          {/* Gradiente de Interação */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-15 pointer-events-none" />

          {/* Botões de Seleção */}
          <div className="absolute bottom-12 w-full max-w-lg px-6 z-20 left-1/2 -translate-x-1/2">
            <AnimatePresence>
              {showButtons && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 gap-3"
                >
                  {levels.map((level, index) => (
                    <motion.button
                      key={level.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                      onClick={() => handleLevelSelect(level)}
                      className={`w-full py-4 bg-gradient-to-r ${level.color} border ${level.borderColor} rounded-xl text-white font-medium hover:brightness-125 transition-all active:scale-[0.98] shadow-lg backdrop-blur-md`}
                    >
                      <span className="tracking-[0.2em] uppercase text-xs font-bold">{level.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default IASelection;
