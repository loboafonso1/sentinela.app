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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const levels = [
    { id: "iniciante", label: "Iniciante", audio: "/audio/ia_resposta_iniciante.mp3", color: "from-blue-600/20 to-blue-900/40", borderColor: "border-blue-500/30" },
    { id: "observador", label: "Observador", audio: "/audio/ia_resposta_observador.mp3", color: "from-emerald-600/20 to-emerald-900/40", borderColor: "border-emerald-500/30" },
    { id: "analista", label: "Analista", audio: "/audio/ia_resposta_analista.mp3", color: "from-amber-600/20 to-amber-900/40", borderColor: "border-amber-500/30" },
    { id: "investigador", label: "Investigador", audio: "/audio/ia_resposta_investigador.mp3", color: "from-purple-600/20 to-purple-900/40", borderColor: "border-purple-500/30" },
    { id: "especialista", label: "Especialista", audio: "/audio/ia_resposta_especialista.mp3", color: "from-rose-600/20 to-rose-900/40", borderColor: "border-rose-500/30" },
  ];

  const handleStart = async () => {
    setHasStarted(true);
    
    if (videoRef.current) {
      try {
        videoRef.current.muted = false;
        videoRef.current.currentTime = 0;
        videoRef.current.loop = false; // Garante que não está em loop para disparar o onEnded
        
        // Listener direto no atributo onEnded do elemento para máxima compatibilidade
        videoRef.current.onended = () => {
          console.log("Vídeo finalizado - disparando transição");
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
    <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden text-white">
      {!hasStarted ? (
        <div className="z-50 flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-2"
          >
            <h2 className="text-xl font-serif font-bold tracking-widest uppercase opacity-80">Interface Sentinela</h2>
            <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Aguardando Inicialização</p>
          </motion.div>
          
          <button
            onClick={handleStart}
            className="group relative px-12 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:bg-white/10 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            <span className="relative text-sm font-bold tracking-[0.2em] uppercase">Iniciar Conexão</span>
          </button>
        </div>
      ) : (
        <>
          {/* Indicador de carregamento caso o vídeo demore */}
          {!videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
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
                className={`min-w-full min-h-full object-cover pointer-events-none transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 z-15 pointer-events-none" />

          <div className="absolute bottom-12 w-full max-w-lg px-6 z-20">
            <AnimatePresence>
              {showButtons && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="grid grid-cols-1 gap-3"
                >
              {levels.map((level, index) => (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  onClick={() => handleLevelSelect(level)}
                  className={`w-full py-4 bg-gradient-to-r ${level.color} border ${level.borderColor} rounded-xl text-white font-medium hover:brightness-125 transition-all active:scale-[0.98] shadow-lg backdrop-blur-sm`}
                >
                  {level.label}
                </motion.button>
              ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default IASelection;
