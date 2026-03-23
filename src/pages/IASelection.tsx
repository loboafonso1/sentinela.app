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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const levels = [
    { id: "iniciante", label: "Iniciante", audio: "/audio/ia_resposta_iniciante.mp3" },
    { id: "observador", label: "Observador", audio: "/audio/ia_resposta_observador.mp3" },
    { id: "analista", label: "Analista", audio: "/audio/ia_resposta_analista.mp3" },
    { id: "investigador", label: "Investigador", audio: "/audio/ia_resposta_investigador.mp3" },
    { id: "especialista", label: "Especialista", audio: "/audio/ia_resposta_especialista.mp3" },
  ];

  useEffect(() => {
    // Tentar forçar o play do vídeo
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.warn("Erro ao iniciar vídeo:", e));
    }

    // Se o áudio ainda não existe, mostramos os botões após um pequeno delay
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2500);

    const introAudio = new Audio("/audio/ia_intro.mp3");
    audioRef.current = introAudio;
    
    const playAudio = async () => {
      try {
        await introAudio.play();
        setIsPlaying(true);
        clearTimeout(timer);
        setShowButtons(false);
      } catch (e) {
        console.warn("Áudio não encontrado ou bloqueado.");
      }
    };

    playAudio();
    
    introAudio.onended = () => {
      setIsPlaying(false);
      setShowButtons(true);
    };

    return () => {
      clearTimeout(timer);
      introAudio.pause();
      introAudio.onended = null;
    };
  }, []);

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

    setTimeout(() => {
      const responseAudio = new Audio(level.audio);
      audioRef.current = responseAudio;
      setIsPlaying(true);
      
      responseAudio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
      
      responseAudio.onended = () => {
        setIsPlaying(false);
        navigate("/proxima-etapa"); 
      };
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden">
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
            loop
            muted
            playsInline
            className={`min-w-full min-h-full object-cover pointer-events-none transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            onCanPlay={() => setVideoLoaded(true)}
            onError={(e) => {
              console.error("Erro no vídeo:", e);
              // Fallback caso o vídeo falhe: mostrar botões direto
              setShowButtons(true);
            }}
          />
        </motion.div>
      </div>

      {/* Gradiente para facilitar leitura */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 z-15 pointer-events-none" />

      {/* Botões de Seleção */}
      <div className="absolute bottom-12 w-full max-w-lg px-6 z-20">
        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid grid-cols-1 gap-3"
            >
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(level)}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                >
                  {level.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IASelection;
