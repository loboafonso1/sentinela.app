import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

type BehavioralFlags = {
  autoEdicao: boolean;
  controleConsciente: boolean;
};

type AnswerRecord = {
  pergunta_id: number;
  resposta_escolhida: string;
  tempo_resposta_ms: number;
};

type AnalysisQuestion = {
  id: number;
  question: string;
  options: string[];
  image: string;
  audio: string;
};

type ProfileSnapshot = {
  xp: number | null;
  reasoning: number | null;
  onboarding_answers: unknown;
  last_analysis_data: unknown;
  behavioral_flags: unknown;
  attention: number | null;
  perception: number | null;
  consistency: number | null;
};

const isAnswerRecord = (v: unknown): v is AnswerRecord => {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.pergunta_id === "number" &&
    typeof r.resposta_escolhida === "string" &&
    typeof r.tempo_resposta_ms === "number"
  );
};

const questions: AnalysisQuestion[] = [
  {
    id: 1,
    question: "Quando você ouve a palavra 'escuro', o que vem primeiro?",
    options: ["Medo", "Silêncio", "Descanso", "Algo te observando"],
    image: "/images/pergunta1.jpg",
    audio: "/audio/analise de padroes p1.mp3"
  },
  {
    id: 2,
    question: "Você está sozinho em casa. De repente… ouve um barulho.",
    options: ["Ignora", "Vai investigar", "Fica alerta, mas não se move", "Pega algo para se defender"],
    image: "/images/pergunta2.jpg",
    audio: "/audio/analise de padroes p2.mp3"
  },
  {
    id: 3,
    question: "Alguém te observa sem falar nada. O que você sente?",
    options: ["Desconforto", "Curiosidade", "Indiferença", "Ameaça"],
    image: "/images/pergunta3.jpg",
    audio: "/audio/analise de padroes p3.mp3"
  },
  {
    id: 4,
    question: "Você já teve a sensação de que alguém te observa… mesmo sozinho?",
    options: ["Nunca", "Às vezes", "Frequentemente", "Sempre"],
    image: "/images/pergunta4.jpg",
    audio: "/audio/analise de padroes p4.mp3"
  },
  {
    id: 5,
    question: "Se seu celular começasse a agir sozinho, você pensaria:",
    options: ["Bug", "Hacker", "Coincidência estranha", "Algo maior acontecendo"],
    image: "/images/pergunta5.jpg",
    audio: "/audio/analise de padroes p5.mp3"
  },
  {
    id: 6,
    question: "Você confia totalmente na tecnologia?",
    options: ["Sim", "Parcialmente", "Não muito", "Não confio"],
    image: "/images/pergunta6.jpg",
    audio: "/audio/analise de padroes p6.mp3"
  },
  {
    id: 7,
    question: "Em uma situação de perigo, você age mais por:",
    options: ["Razão", "Instinto", "Medo", "Estratégia"],
    image: "/images/pergunta7.jpg",
    audio: "/audio/analise de padroes p7.mp3"
  },
  {
    id: 8,
    question: "Se alguém te trai, sua primeira reação é:",
    options: ["Se afastar", "Confrontar", "Ignorar", "Planejar algo"],
    image: "/images/pergunta8.jpg",
    audio: "/audio/analise de padroes p8.mp3"
  },
  {
    id: 9,
    question: "Você prefere:",
    options: ["Segurança", "Liberdade", "Controle", "Poder"],
    image: "/images/pergunta9.jpg",
    audio: "/audio/analise de padroes p9.mp3"
  },
  {
    id: 10,
    question: "Você se vê como alguém:",
    options: ["Observador", "Reativo", "Calculista", "Imprevisível"],
    image: "/images/pergunta10.jpg",
    audio: "/audio/analise de padroes p10.mp3"
  },
  {
    id: 11,
    question: "Se ninguém estivesse te observando, você:",
    options: ["Seria o mesmo", "Mudaria um pouco", "Mudaria muito", "Não sabe"],
    image: "/images/pergunta11.jpg",
    audio: "/audio/analise de padroes p11.mp3"
  },
  {
    id: 12,
    question: "Você acredita que as pessoas escondem quem realmente são?",
    options: ["Não", "Às vezes", "Quase sempre", "Sempre"],
    image: "/images/pergunta12.jpg",
    audio: "/audio/analise de padroes p12.mp3"
  }
];

const AnalisePadroes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timer, setTimer] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [questionImageSrc, setQuestionImageSrc] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const questionAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioErrorOnce, setAudioErrorOnce] = useState(false);
  const imageCandidatesRef = useRef<string[]>([]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setTimer(elapsed);
    }, 10);
  }, [stopTimer]);

  const audioRefCleanup = useCallback(() => {
    if (!questionAudioRef.current) return;
    questionAudioRef.current.pause();
    questionAudioRef.current.currentTime = 0;
    questionAudioRef.current = null;
  }, []);

  useEffect(() => {
    startTimer();
    setIsAnswering(false);

    const currentQuestion = questions[currentStep];

    const id = currentQuestion.id;
    const candidates = [
      `/images/pergunta${id}.jpg`,
      `/images/questions/pergunta${id}.jpg`,
      `/images/pergunta${id}.jpeg`,
      `/images/questions/pergunta${id}.jpeg`,
      `/images/pergunta${id}.png`,
      `/images/questions/pergunta${id}.png`,
      `/images/pergunta${id}.jpg.jpg`,
      `/images/questions/pergunta${id}.jpg.jpg`,
      currentQuestion.image
    ].filter((v, i, arr) => !!v && arr.indexOf(v) === i);

    imageCandidatesRef.current = candidates;
    setQuestionImageSrc(candidates[0] ?? "");

    if (currentQuestion?.audio && user) {
      const audio = new Audio(encodeURI(currentQuestion.audio));
      audio.preload = "auto";
      audioRefCleanup();
      questionAudioRef.current = audio;
      audio.play().catch(() => {
        if (!audioErrorOnce) setAudioErrorOnce(true);
      });
    }

    return () => {
      stopTimer();
      audioRefCleanup();
    };
  }, [audioErrorOnce, audioRefCleanup, currentStep, startTimer, stopTimer, user]);

  const handleQuestionImageError = () => {
    const remaining = imageCandidatesRef.current.slice(1);
    imageCandidatesRef.current = remaining;
    setQuestionImageSrc(remaining[0] ?? "");
  };

  const handleAnswer = async (option: string) => {
    if (isAnswering) return;
    setIsAnswering(true);
    const responseTime = Date.now() - startTimeRef.current;
    stopTimer();
    audioRefCleanup();

    const newAnswer: AnswerRecord = {
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

  const finishAnalysis = async (allAnswers: AnswerRecord[]) => {
    setShowTransition(true);
    
    let consistencia = 100;
    let autoEdicao = false;
    let controleConsciente = false;

    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, reasoning, onboarding_answers, last_analysis_data, attention, perception, consistency, behavioral_flags")
      .eq("id", user?.id)
      .single();

    const profileSnapshot = profile as unknown as ProfileSnapshot | null;

    const previousAttemptFromOnboarding = (() => {
      const onboarding = profileSnapshot?.onboarding_answers;
      if (!onboarding || typeof onboarding !== "object") return undefined;
      const analysis = (onboarding as Record<string, unknown>).analysis;
      if (!analysis || typeof analysis !== "object") return undefined;
      const last = (analysis as Record<string, unknown>).last_attempt;
      if (!Array.isArray(last)) return undefined;
      const parsed = last.filter(isAnswerRecord);
      return parsed.length ? parsed : undefined;
    })();

    const previousAttemptFromColumn = (() => {
      const raw = profileSnapshot?.last_analysis_data;
      if (!Array.isArray(raw)) return undefined;
      const parsed = raw.filter(isAnswerRecord);
      return parsed.length ? parsed : undefined;
    })();

    const previousAttempt = previousAttemptFromOnboarding || previousAttemptFromColumn;

    if (previousAttempt) {
      const lastAnswers = previousAttempt;
      let changedCount = 0;
      
      allAnswers.forEach((ans, idx) => {
        if (lastAnswers[idx] && lastAnswers[idx].resposta_escolhida !== ans.resposta_escolhida) {
          changedCount++;
        }
      });

      consistencia = Math.round(100 - (changedCount / questions.length * 100));
      
      if ((changedCount / questions.length) > 0.4) autoEdicao = true;
      
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

    const avgTime = allAnswers.reduce((acc, curr) => acc + curr.tempo_resposta_ms, 0) / allAnswers.length;
    let atencao = Math.round(Math.max(0, 100 - (avgTime / 5000 * 100))); // 5s como base 0
    if (consistencia > 80) atencao += 10;

    // PERCEPÇÃO: baseada em respostas de vigilância
    const vigilanceTerms = ["Algo te observando", "Vai investigar", "Ameaça", "Sempre", "Hacker", "Algo maior acontecendo", "Calculista"];
    const vigilanceCount = allAnswers.filter(ans => vigilanceTerms.includes(ans.resposta_escolhida)).length;
    const percepcao = Math.round((vigilanceCount / questions.length) * 100 + 20); // Base + 20

    // RACIOCÍNIO: tempo médio + padrão equilibrado
    let raciocinio = Math.round(profileSnapshot?.reasoning ?? 70);
    if (avgTime > 1500 && avgTime < 3500) raciocinio += 5; // Tempo equilibrado indica reflexão

    let totalXpGain = 0;
    allAnswers.forEach(ans => {
      if (ans.tempo_resposta_ms < 1500) totalXpGain += 50;
      else if (ans.tempo_resposta_ms < 3000) totalXpGain += 30;
      else totalXpGain += 10;
    });
    if (consistencia > 90) totalXpGain += 200;

    const metricsPayload = {
      xp_gain: totalXpGain,
      attention: Math.min(100, atencao),
      reasoning: Math.min(100, raciocinio),
      perception: Math.min(100, percepcao),
      consistency: Math.min(100, consistencia),
      flags: { autoEdicao, controleConsciente },
      finished_at: new Date().toISOString()
    };

    if (user) {
      try {
        localStorage.setItem(
          `sentinela:analysis:lastMetrics:${user.id}`,
          JSON.stringify(metricsPayload)
        );
        localStorage.setItem(
          `sentinela:analysis:lastAttempt:${user.id}`,
          JSON.stringify(allAnswers)
        );
      } catch {
        // ignore
      }

      const nextOnboarding = {
        ...(profileSnapshot?.onboarding_answers && typeof profileSnapshot.onboarding_answers === "object"
          ? (profileSnapshot.onboarding_answers as Record<string, unknown>)
          : {}),
        analysis: {
          last_attempt: allAnswers,
          previous_attempt: previousAttempt || null,
          diff: previousAttempt
            ? {
                changed_count: allAnswers.filter((ans, idx) => previousAttempt[idx]?.resposta_escolhida !== ans.resposta_escolhida).length,
                total: questions.length
              }
            : null,
          metrics: metricsPayload
        }
      };

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ 
          xp: ((profileSnapshot?.xp ?? 0) || 0) + totalXpGain,
          consistency: Math.min(100, consistencia),
          attention: Math.min(100, atencao),
          perception: Math.min(100, percepcao),
          reasoning: Math.min(100, raciocinio),
          last_analysis_data: allAnswers,
          behavioral_flags: { autoEdicao, controleConsciente },
          onboarding_answers: nextOnboarding
        })
        .eq("id", user.id);

      if (updateErr) {
        await supabase
          .from("profiles")
          .update({ onboarding_answers: nextOnboarding })
          .eq("id", user.id);
      }
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
            {questionImageSrc && (
              <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#7A00FF]/50 via-[#00F2FF]/10 to-[#FF00D9]/40 opacity-40 blur-xl" />
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                  <img src={questionImageSrc} onError={handleQuestionImageError} alt="Contexto" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(122,0,255,0.25)_0%,_transparent_55%)]" />
                  <div className="absolute top-5 right-5 w-16 h-24 rounded-[999px] overflow-hidden border border-[#7A00FF]/30 bg-black shadow-[0_0_30px_rgba(122,0,255,0.35)]">
                    <video
                      src="/video/ia_avatar.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-110 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-xl font-medium leading-relaxed text-center text-white/90">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswering}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative w-full rounded-2xl text-left transition-all ${
                    isAnswering ? "opacity-60" : "opacity-100"
                  }`}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7A00FF]/60 via-[#00F2FF]/20 to-[#FF00D9]/50 opacity-30 blur-md" />
                  <div className="relative w-full py-5 px-8 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40" />
                    <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none bg-white/[0.03]" />
                    <span className="text-sm font-semibold tracking-wide text-white/90">{option}</span>
                  </div>
                </motion.button>
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
