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
    { id: "iniciante", label: "Iniciante", audio: "/audio/ia_resposta_iniciante.mp3", color: "from-[#00F2FF]/20 to-[#FF00D9]/40", borderColor: "border-[#00F2FF]/30" },
    { id: "observador", label: "Observador", audio: "/audio/ia_resposta_observador.mp3", color: "from-[#00F2FF]/20 to-[#FF00D9]/40", borderColor: "border-[#00F2FF]/30" },
    { id: "analista", label: "Analista", audio: "/audio/ia_resposta_analista.mp3", color: "from-[#00F2FF]/20 to-[#FF00D9]/40", borderColor: "border-[#00F2FF]/30" },
    { id: "investigador", label: "Investigador", audio: "/audio/ia_resposta_investigador.mp3", color: "from-[#00F2FF]/20 to-[#FF00D9]/40", borderColor: "border-[#00F2FF]/30" },
    { id: "especialista", label: "Especialista", audio: "/audio/ia_resposta_especialista.mp3", color: "from-[#00F2FF]/20 to-[#FF00D9]/40", borderColor: "border-[#00F2FF]/30" },
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
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center overflow-hidden text-white font-sans selection:bg-purple-500/20">
      {/* Efeito de Ruído Digital Sutil */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Gradiente Roxo Sutil nas Bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(88,28,135,0.05)_100%)] z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-0" />

      {!hasStarted ? (
        <div className="z-50 flex flex-col items-center justify-between h-full py-20 px-6 w-full max-w-lg">
          {/* Título Superior */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [0.99, 1, 0.99]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-center relative"
          >
            <h2 className="text-[10px] font-light tracking-[0.6em] uppercase text-white/40 mb-2">Interface</h2>
            <h1 className="text-4xl font-serif font-bold tracking-[0.4em] uppercase bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              Sentinela
            </h1>
          </motion.div>

          {/* Frases de Inicialização Centrais */}
          <div className="flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={loadingPhraseIndex}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 1.5 }}
                className="text-center"
              >
                <p className="text-xl font-light tracking-[0.2em] text-purple-400/90 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                  {loadingPhrases[loadingPhraseIndex]}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block ml-2 w-0.5 h-6 bg-purple-500/50 align-middle"
                  />
                </p>
              </motion.div>
            </AnimatePresence>
            
            <motion.p 
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[9px] text-white/20 uppercase tracking-[0.5em]"
            >
              Aguardando Ativação
            </motion.p>
          </div>
          
          {/* Botão de Início */}
          <div className="w-full px-4">
            <button
              onClick={handleStart}
              disabled={isConnecting}
              className="group relative w-full py-7 bg-gradient-to-br from-purple-900/40 to-purple-600/20 border border-purple-500/20 rounded-2xl overflow-hidden transition-all duration-700 hover:from-purple-800/50 hover:to-purple-500/40 hover:border-purple-400/40 active:scale-[0.97] shadow-[0_0_25px_rgba(147,51,234,0.1)] hover:shadow-[0_0_40px_rgba(147,51,234,0.25)]"
            >
              <AnimatePresence mode="wait">
                {!isConnecting ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <span className="text-sm font-bold tracking-[0.4em] uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Iniciar Conexão</span>
                    <motion.div
                      animate={{ x: [0, 4, 0], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
                    <div className="w-5 h-5 border-2 border-white/10 border-t-purple-400 rounded-full animate-spin" />
                    <span className="text-sm font-bold tracking-[0.4em] uppercase text-purple-200">Conectando</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Efeito de Brilho de Energia */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.15)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_4s_infinite] pointer-events-none" />
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
