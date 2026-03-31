import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

const questions = [
  {
    id: 1,
    question: "Quando você ouve a palavra 'escuro', o que vem primeiro?",
    options: ["Medo", "Silêncio", "Descanso", "Algo te observando"],
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    question: "Você está sozinho em casa. De repente… ouve um barulho.",
    options: ["Ignora", "Vai investigar", "Fica alerta, mas não se move", "Pega algo para se defender"],
    image: null
  },
  {
    id: 3,
    question: "Alguém te observa sem falar nada. O que você sente?",
    options: ["Desconforto", "Curiosidade", "Indiferença", "Ameaça"],
    image: null
  },
  {
    id: 4,
    question: "Você já teve a sensação de que alguém te observa… mesmo sozinho?",
    options: ["Nunca", "Às vezes", "Frequentemente", "Sempre"],
    image: null
  },
  {
    id: 5,
    question: "Se seu celular começasse a agir sozinho, você pensaria:",
    options: ["Bug", "Hacker", "Coincidência estranha", "Algo maior acontecendo"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    question: "Você confia totalmente na tecnologia?",
    options: ["Sim", "Parcialmente", "Não muito", "Não confio"],
    image: null
  },
  {
    id: 7,
    question: "Em uma situação de perigo, você age mais por:",
    options: ["Razão", "Instinto", "Medo", "Estratégia"],
    image: null
  },
  {
    id: 8,
    question: "Se alguém te trai, sua primeira reação é:",
    options: ["Se afastar", "Confrontar", "Ignorar", "Planejar algo"],
    image: null
  },
  {
    id: 9,
    question: "Você prefere:",
    options: ["Segurança", "Liberdade", "Controle", "Poder"],
    image: null
  },
  {
    id: 10,
    question: "Você se vê como alguém:",
    options: ["Observador", "Reativo", "Calculista", "Imprevisível"],
    image: null
  },
  {
    id: 11,
    question: "Se ninguém estivesse te observando, você:",
    options: ["Seria o mesmo", "Mudaria um pouco", "Mudaria muito", "Não sabe"],
    image: null
  },
  {
    id: 12,
    question: "Você acredita que as pessoas escondem quem realmente são?",
    options: ["Não", "Às vezes", "Quase sempre", "Sempre"],
    image: null
  }
];

const AnalisePadroes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timer, setTimer] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [currentStep]);

  const startTimer = () => {
    stopTimer();
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setTimer(elapsed);
    }, 10);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleAnswer = async (option: string) => {
    const responseTime = Date.now() - startTimeRef.current;
    stopTimer();

    const newAnswer = {
      pergunta_id: questions[currentStep].id,
      resposta_escolhida: option,
      tempo_resposta_ms: responseTime
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishAnalysis(updatedAnswers);
    }
  };

  const finishAnalysis = async (allAnswers: any[]) => {
    setShowTransition(true);
    
    // Lógica Oculta de Processamento
    let totalXp = 0;
    allAnswers.forEach(ans => {
      // Bônus Velocidade
      if (ans.tempo_resposta_ms < 1500) totalXp += 50;
      else if (ans.tempo_resposta_ms < 3000) totalXp += 30;
      else totalXp += 10;

      // Lógica de Padrão (Simulada para XP)
      const threatTerms = ["Algo te observando", "Ameaça", "Poder", "Calculista", "Sempre"];
      if (threatTerms.includes(ans.resposta_escolhida)) totalXp += 20;
    });

    // Salvar no Supabase
    if (user) {
      // Aqui salvaríamos os dados brutos em uma tabela de logs se necessário
      // E atualizaríamos o XP do perfil
      const { data: profile } = await supabase
        .from("profiles")
        .select("xp")
        .eq("id", user.id)
        .single();
      
      const currentXp = profile?.xp || 0;
      await supabase
        .from("profiles")
        .update({ xp: currentXp + totalXp })
        .eq("id", user.id);
    }

    // Navegar para resultado com o XP gerado
    setTimeout(() => {
      navigate("/resultado-analise", { state: { xp: totalXp } });
    }, 3000);
  };

  const formatTimer = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-[#0A0014] flex items-center justify-center p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <p className="text-xl font-light tracking-[0.2em] leading-relaxed text-white/80">
            Você respondeu…<br />
            mas não percebeu…<br />
            que já começou a ser analisado.
          </p>
          <div className="pt-8">
            <div className="w-12 h-12 border-2 border-[#7A00FF] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="fixed inset-0 bg-[#0A0014] text-white flex flex-col font-sans overflow-hidden">
      {/* HUD de Timer */}
      <div className="absolute top-12 left-0 right-0 z-50 flex flex-col items-center">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-2 font-bold">Tempo de Resposta</span>
        <div className="text-2xl font-mono font-bold text-[#00F2FF] drop-shadow-[0_0_10px_rgba(0,242,255,0.4)]">
          {formatTimer(timer)}
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-24 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md space-y-12"
          >
            {currentQuestion.image && (
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img src={currentQuestion.image} alt="Contexto" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <h2 className="text-xl font-medium leading-relaxed text-center text-white/90">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full py-5 px-8 bg-white/5 border border-white/10 rounded-2xl text-left text-sm font-medium hover:bg-white/10 active:bg-[#7A00FF]/20 active:border-[#7A00FF]/50 transition-all backdrop-blur-xl"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar Sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <motion.div 
          className="h-full bg-[#7A00FF]" 
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Background Noise */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default AnalisePadroes;
