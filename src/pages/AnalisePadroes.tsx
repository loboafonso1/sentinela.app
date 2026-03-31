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
    image: "https://images.unsplash.com/photo-1558444479-c8f02e62770e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    question: "Alguém te observa sem falar nada. O que você sente?",
    options: ["Desconforto", "Curiosidade", "Indiferença", "Ameaça"],
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
  },
  {
    id: 4,
    question: "Você já teve a sensação de que alguém te observa… mesmo sozinho?",
    options: ["Nunca", "Às vezes", "Frequentemente", "Sempre"],
    image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=2042&auto=format&fit=crop"
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
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 7,
    question: "Em uma situação de perigo, você age mais por:",
    options: ["Razão", "Instinto", "Medo", "Estratégia"],
    image: "https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 8,
    question: "Se alguém te trai, sua primeira reação é:",
    options: ["Se afastar", "Confrontar", "Ignorar", "Planejar algo"],
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2050&auto=format&fit=crop"
  },
  {
    id: 9,
    question: "Você prefere:",
    options: ["Segurança", "Liberdade", "Controle", "Poder"],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2062&auto=format&fit=crop"
  },
  {
    id: 10,
    question: "Você se vê como alguém:",
    options: ["Observador", "Reativo", "Calculista", "Imprevisível"],
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 11,
    question: "Se ninguém estivesse te observando, você:",
    options: ["Seria o mesmo", "Mudaria um pouco", "Mudaria muito", "Não sabe"],
    image: "https://images.unsplash.com/photo-1483736762161-1d107f3c78e1?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 12,
    question: "Você acredita que as pessoas escondem quem realmente são?",
    options: ["Não", "Às vezes", "Quase sempre", "Sempre"],
    image: "https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=2047&auto=format&fit=crop"
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
    
    // 1. Cálculo de Consistência
    let consistencia = 100;
    let autoEdicao = false;
    let controleConsciente = false;

    // Buscar tentativa anterior no Supabase
    const { data: profile } = await supabase
      .from("profiles")
      .select("last_analysis_data, attention, reasoning, perception, consistency, xp")
      .eq("id", user?.id)
      .single();

    if (profile?.last_analysis_data) {
      const lastAnswers = profile.last_analysis_data as any[];
      let changedCount = 0;
      
      allAnswers.forEach((ans, idx) => {
        if (lastAnswers[idx] && lastAnswers[idx].resposta_escolhida !== ans.resposta_escolhida) {
          changedCount++;
        }
      });

      consistencia = Math.round(100 - (changedCount / questions.length * 100));
      
      // Detecção de Autoedição (> 40% mudou)
      if ((changedCount / questions.length) > 0.4) autoEdicao = true;
      
      // Detecção de Controle Consciente (redução de respostas emocionais)
      // (Lógica simplificada: se mudou respostas de "Medo/Desconforto" para "Ignora/Indiferença")
      const emotionalTerms = ["Medo", "Desconforto", "Ameaça"];
      const neutralTerms = ["Ignora", "Indiferença", "Silêncio"];
      
      let emotionalToNeutral = 0;
      allAnswers.forEach((ans, idx) => {
        if (lastAnswers[idx] && 
            emotionalTerms.includes(lastAnswers[idx].resposta_escolhida) && 
            neutralTerms.includes(ans.resposta_escolhida)) {
          emotionalToNeutral++;
        }
      });
      if (emotionalToNeutral > 2) controleConsciente = true;
    }

    // 2. Ajuste das Outras Métricas
    // ATENÇÃO: baseada no tempo médio
    const avgTime = allAnswers.reduce((acc, curr) => acc + curr.tempo_resposta_ms, 0) / allAnswers.length;
    let atencao = Math.round(Math.max(0, 100 - (avgTime / 5000 * 100))); // 5s como base 0
    if (consistencia > 80) atencao += 10;

    // PERCEPÇÃO: baseada em respostas de vigilância
    const vigilanceTerms = ["Algo te observando", "Vai investigar", "Ameaça", "Sempre", "Hacker", "Algo maior acontecendo", "Calculista"];
    const vigilanceCount = allAnswers.filter(ans => vigilanceTerms.includes(ans.resposta_escolhida)).length;
    const percepcao = Math.round((vigilanceCount / questions.length) * 100 + 20); // Base + 20

    // RACIOCÍNIO: tempo médio + padrão equilibrado
    let raciocinio = Math.round(profile?.reasoning || 70);
    if (avgTime > 1500 && avgTime < 3500) raciocinio += 5; // Tempo equilibrado indica reflexão

    // 3. Sistema de XP
    let totalXpGain = 0;
    allAnswers.forEach(ans => {
      if (ans.tempo_resposta_ms < 1500) totalXpGain += 50;
      else if (ans.tempo_resposta_ms < 3000) totalXpGain += 30;
      else totalXpGain += 10;
    });
    if (consistencia > 90) totalXpGain += 200;

    // 4. Salvar tudo no Supabase
    if (user) {
      await supabase
        .from("profiles")
        .update({ 
          xp: (profile?.xp || 0) + totalXpGain,
          consistency: Math.min(100, consistencia),
          attention: Math.min(100, atencao),
          perception: Math.min(100, percepcao),
          reasoning: Math.min(100, raciocinio),
          last_analysis_data: allAnswers,
          behavioral_flags: { autoEdicao, controleConsciente }
        })
        .eq("id", user.id);
    }

    // Navegar para resultado
    setTimeout(() => {
      navigate("/resultado-analise", { state: { xp: totalXpGain } });
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
