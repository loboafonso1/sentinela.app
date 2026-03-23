import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, Search, Zap, Crown } from "lucide-react";

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
    { 
      id: "iniciante", 
      label: "Iniciante", 
      audio: "/audio/ia_resposta_iniciante.mp3", 
      color: "#00D1FF",
      icon: <Shield className="w-5 h-5" />
    },
    { 
      id: "observador", 
      label: "Observador", 
      audio: "/audio/ia_resposta_observador.mp3", 
      color: "#00FF94",
      icon: <Eye className="w-5 h-5" />
    },
    { 
      id: "analista", 
      label: "Analista", 
      audio: "/audio/ia_resposta_analista.mp3", 
      color: "#FF9900",
      icon: <Search className="w-5 h-5" />
    },
    { 
      id: "investigador", 
      label: "Investigador", 
      audio: "/audio/ia_resposta_investigador.mp3", 
      color: "#FF00D9",
      icon: <Zap className="w-5 h-5" />
    },
    { 
      id: "especialista", 
      label: "Especialista", 
      audio: "/audio/ia_resposta_especialista.mp3", 
      color: "#FF005C",
      icon: <Crown className="w-5 h-5" />
    },
  ];

  useEffect(() => {
    if (!hasStarted) {
      const interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hasStarted, loadingPhrases.length]);

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
    <div className="fixed inset-0 bg-[#0A0014] flex flex-col items-center justify-center overflow-hidden text-white font-sans selection:bg-purple-500/20">
      {/* Efeito de Ruído Digital Sutil */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Gradiente Vibrante de Fundo conforme referência */}
      <div className="absolute inset-0 bg-[#4C00B0] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#0A0014_0%,_transparent_70%)] z-1" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_#7A00FF_0%,_transparent_60%)] opacity-60 z-1" />
      <div className="absolute inset-0 bg-black/20 z-1" />

      {!hasStarted ? (
        <div className="z-50 flex flex-col items-center justify-between h-full py-20 px-6 w-full max-w-lg">
          {/* Título Superior */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.6, 0.9, 0.6],
              scale: [0.99, 1, 0.99]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-center relative"
          >
            <h2 className="text-[10px] font-light tracking-[0.6em] uppercase text-white/60 mb-2">Interface</h2>
            <h1 className="text-4xl font-serif font-bold tracking-[0.4em] uppercase bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
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
                <p className="text-xl font-light tracking-[0.2em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                  {loadingPhrases[loadingPhraseIndex]}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block ml-2 w-0.5 h-6 bg-white/60 align-middle"
                  />
                </p>
              </motion.div>
            </AnimatePresence>
            
            <motion.p 
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-[11px] font-medium text-white/70 uppercase tracking-[0.6em] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            >
              Aguardando Ativação
            </motion.p>
          </div>
          
          {/* Botão de Início */}
          <div className="w-full px-4">
            <button
              onClick={handleStart}
              disabled={isConnecting}
              className="group relative w-full py-7 bg-gradient-to-r from-[#FF00D9]/20 via-[#00F2FF]/20 to-[#FF00D9]/20 border border-white/10 rounded-2xl overflow-hidden transition-all duration-700 hover:border-white/30 active:scale-[0.97] shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] backdrop-blur-xl"
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
                      animate={{ x: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-sm font-bold tracking-[0.4em] uppercase text-white">Conectando</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Efeito de Reflexo de Borda (Glow nas pontas conforme referência) */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F2FF] to-transparent opacity-40" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF00D9] to-transparent opacity-40" />
              
              {/* Brilho de Energia Interno */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF00D9]/10 via-[#00F2FF]/10 to-[#FF00D9]/10 opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent -translate-x-full group-hover:animate-[shimmer_4s_infinite] pointer-events-none" />
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
                src={`/video/ia_avatar.mp4?v=${Date.now()}`}
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
                  className="grid grid-cols-1 gap-4"
                >
                  {levels.map((level, index) => (
                    <motion.button
                      key={level.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                      onClick={() => handleLevelSelect(level)}
                      whileHover={{ 
                        backgroundColor: `${level.color}22`,
                        borderColor: `${level.color}88`,
                        boxShadow: `0 0 30px ${level.color}44, inset 0 0 15px ${level.color}22`
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        backgroundColor: level.color,
                        borderColor: "#FFFFFF",
                        boxShadow: `0 0 40px ${level.color}88`
                      }}
                      className="w-full py-4 px-8 bg-black/40 border-2 rounded-full text-white flex items-center gap-5 group transition-all backdrop-blur-xl"
                    >
                      <motion.div 
                        style={{ color: level.color }} 
                        variants={{
                          tap: { color: "#FFFFFF" }
                        }}
                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                      >
                        {level.icon}
                      </motion.div>
                      <motion.span 
                        variants={{
                          tap: { color: "#FFFFFF" }
                        }}
                        className="tracking-[0.3em] uppercase text-[10px] font-bold text-white/80 group-hover:text-white transition-colors"
                      >
                        {level.label}
                      </motion.span>
                      <div className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </div>
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
