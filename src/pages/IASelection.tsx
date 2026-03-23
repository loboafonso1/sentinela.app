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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const levels = [
    { id: "iniciante", label: "Iniciante", audio: "/audio/ia_resposta_iniciante.mp3" },
    { id: "observador", label: "Observador", audio: "/audio/ia_resposta_observador.mp3" },
    { id: "analista", label: "Analista", audio: "/audio/ia_resposta_analista.mp3" },
    { id: "investigador", label: "Investigador", audio: "/audio/ia_resposta_investigador.mp3" },
    { id: "especialista", label: "Especialista", audio: "/audio/ia_resposta_especialista.mp3" },
  ];

  useEffect(() => {
    // Tocar áudio de introdução ao entrar
    const introAudio = new Audio("/audio/ia_intro.mp3");
    audioRef.current = introAudio;
    setIsPlaying(true);
    
    introAudio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    
    introAudio.onended = () => {
      setIsPlaying(false);
      setShowButtons(true);
    };

    return () => {
      introAudio.pause();
      introAudio.onended = null;
    };
  }, []);

  const handleLevelSelect = async (level: typeof levels[0]) => {
    if (selectedLevel) return;
    
    setSelectedLevel(level.id);
    setShowButtons(false);
    
    // Salvar no banco de dados
    if (user) {
      await supabase
        .from("profiles")
        .update({ user_level_name: level.label })
        .eq("id", user.id);
    }

    // Delay curto antes da resposta
    setTimeout(() => {
      const responseAudio = new Audio(level.audio);
      audioRef.current = responseAudio;
      setIsPlaying(true);
      
      responseAudio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
      
      responseAudio.onended = () => {
        setIsPlaying(false);
        // Redirecionar para a próxima tela após o áudio
        navigate("/proxima-etapa"); 
      };
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden">
      {/* Avatar IA em loop */}
      <div className="relative w-64 h-64 md:w-96 md:h-96">
        <motion.div
          animate={isPlaying ? {
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          } : {
            scale: 1,
            opacity: 0.8
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <video
            src="/video/ia_avatar.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>

      {/* Botões de Seleção */}
      <div className="absolute bottom-12 w-full max-w-lg px-6">
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
