import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type AnswerRecord = {
  pergunta_id: number;
  resposta_escolhida: string;
  tempo_resposta_ms: number;
};

type MetricsPayload = {
  xp_gain: number;
  attention: number;
  reasoning: number;
  perception: number;
  consistency: number;
  flags: { autoEdicao: boolean; controleConsciente: boolean };
  finished_at: string;
};

type AnalysisQuestion = {
  id: number;
  question: string;
  options: string[];
  image: string;
  audio: string;
};

const isAnswerRecord = (v: unknown): v is AnswerRecord => {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return typeof r.pergunta_id === "number" && typeof r.resposta_escolhida === "string" && typeof r.tempo_resposta_ms === "number";
};

const questions: AnalysisQuestion[] = [
  {
    id: 1,
    question: "Quando você ouve a palavra 'escuro', o que vem primeiro?",
    options: ["Medo", "Silêncio", "Descanso", "Algo te observando"],
    image: "/images/pergunta1.jpg",
    audio: "/audio/analise de padroes p1.mp3",
  },
  {
    id: 2,
    question: "Você está sozinho em casa. De repente… ouve um barulho.",
    options: ["Ignora", "Vai investigar", "Fica alerta, mas não se move", "Pega algo para se defender"],
    image: "/images/pergunta2.jpg",
    audio: "/audio/analise de padroes p2.mp3",
  },
  {
    id: 3,
    question: "Alguém te observa sem falar nada. O que você sente?",
    options: ["Desconforto", "Curiosidade", "Indiferença", "Ameaça"],
    image: "/images/pergunta3.jpg",
    audio: "/audio/analise de padroes p3.mp3",
  },
  {
    id: 4,
    question: "Você já teve a sensação de que alguém te observa… mesmo sozinho?",
    options: ["Nunca", "Às vezes", "Frequentemente", "Sempre"],
    image: "/images/pergunta4.jpg",
    audio: "/audio/analise de padroes p4.mp3",
  },
  {
    id: 5,
    question: "Se seu celular começasse a agir sozinho, você pensaria:",
    options: ["Bug", "Hacker", "Coincidência estranha", "Algo maior acontecendo"],
    image: "/images/pergunta5.jpg",
    audio: "/audio/analise de padroes p5.mp3",
  },
  {
    id: 6,
    question: "Você confia totalmente na tecnologia?",
    options: ["Sim", "Parcialmente", "Não muito", "Não confio"],
    image: "/images/pergunta6.jpg",
    audio: "/audio/analise de padroes p6.mp3",
  },
  {
    id: 7,
    question: "Em uma situação de perigo, você age mais por:",
    options: ["Razão", "Instinto", "Medo", "Estratégia"],
    image: "/images/pergunta7.jpg",
    audio: "/audio/analise de padroes p7.mp3",
  },
  {
    id: 8,
    question: "Se alguém te trai, sua primeira reação é:",
    options: ["Se afastar", "Confrontar", "Ignorar", "Planejar algo"],
    image: "/images/pergunta8.jpg",
    audio: "/audio/analise de padroes p8.mp3",
  },
  {
    id: 9,
    question: "Você prefere:",
    options: ["Segurança", "Liberdade", "Controle", "Poder"],
    image: "/images/pergunta9.jpg",
    audio: "/audio/analise de padroes p9.mp3",
  },
  {
    id: 10,
    question: "Você se vê como alguém:",
    options: ["Observador", "Reativo", "Calculista", "Imprevisível"],
    image: "/images/pergunta10.jpg",
    audio: "/audio/analise de padroes p10.mp3",
  },
  {
    id: 11,
    question: "Se ninguém estivesse te observando, você:",
    options: ["Seria o mesmo", "Mudaria um pouco", "Mudaria muito", "Não sabe"],
    image: "/images/pergunta11.jpg",
    audio: "/audio/analise de padroes p11.mp3",
  },
  {
    id: 12,
    question: "Você acredita que as pessoas escondem quem realmente são?",
    options: ["Não", "Às vezes", "Quase sempre", "Sempre"],
    image: "/images/pergunta12.jpg",
    audio: "/audio/analise de padroes p12.mp3",
  },
];

const QUESTION_LIMIT_MS = 10_000;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t, 0, 1);

const lerpColor = (aHex: string, bHex: string, t: number) => {
  const a = hexToRgb(aHex);
  const b = hexToRgb(bHex);
  const r = Math.round(lerp(a.r, b.r, t));
  const g = Math.round(lerp(a.g, b.g, t));
  const b2 = Math.round(lerp(a.b, b.b, t));
  return `rgb(${r}, ${g}, ${b2})`;
};

const timeBarColor = (progress01: number) => {
  const p = clamp(progress01, 0, 1);
  if (p <= 0.5) return lerpColor("#00FF9C", "#FFC857", p / 0.5);
  return lerpColor("#FFC857", "#FF4D6D", (p - 0.5) / 0.5);
};

const AnalisePadroes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || "local";

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [remainingMs, setRemainingMs] = useState(QUESTION_LIMIT_MS);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [questionImageSrc, setQuestionImageSrc] = useState<string>("");
  const [timeExpired, setTimeExpired] = useState(false);

  const startedAtRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imageCandidatesRef = useRef<string[]>([]);

  const stop = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const cleanupAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    startedAtRef.current = Date.now();
    setRemainingMs(QUESTION_LIMIT_MS);
    setElapsedMs(0);
    setTimeExpired(false);
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      const next = Math.max(0, QUESTION_LIMIT_MS - elapsed);
      setRemainingMs(next);
      setElapsedMs(elapsed);
      setTimeExpired(elapsed >= QUESTION_LIMIT_MS);
    }, 10);
  }, [stop]);

  useEffect(() => {
    setIsAnswering(false);
    start();

    const q = questions[currentStep];
    const id = q.id;
    const candidates = [
      `/images/pergunta${id}.jpg`,
      `/images/pergunta${id}.jpeg`,
      `/images/pergunta${id}.png`,
      q.image,
    ].filter((v, i, arr) => !!v && arr.indexOf(v) === i);
    imageCandidatesRef.current = candidates;
    setQuestionImageSrc(candidates[0] || "");

    cleanupAudio();
    const a = new Audio(encodeURI(q.audio));
    a.preload = "auto";
    audioRef.current = a;
    a.play().catch(() => void 0);

    return () => {
      stop();
      cleanupAudio();
    };
  }, [cleanupAudio, currentStep, start, stop]);

  const handleQuestionImageError = () => {
    const remaining = imageCandidatesRef.current.slice(1);
    imageCandidatesRef.current = remaining;
    setQuestionImageSrc(remaining[0] ?? "");
  };

  const formatTimer = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  const computeMetrics = (allAnswers: AnswerRecord[], previousAttempt?: AnswerRecord[]): MetricsPayload => {
    let consistencia = 100;
    let autoEdicao = false;
    let controleConsciente = false;

    if (previousAttempt && previousAttempt.length) {
      let changed = 0;
      allAnswers.forEach((a, i) => {
        if (previousAttempt[i] && previousAttempt[i].resposta_escolhida !== a.resposta_escolhida) changed++;
      });
      consistencia = Math.round(100 - (changed / questions.length) * 100);
      if (changed / questions.length > 0.4) autoEdicao = true;

      const emotional = ["Medo", "Desconforto", "Ameaça"];
      const neutral = ["Ignora", "Indiferença", "Silêncio"];
      let emotionalToNeutral = 0;
      allAnswers.forEach((a, i) => {
        const prev = previousAttempt[i]?.resposta_escolhida;
        if (prev && emotional.includes(prev) && neutral.includes(a.resposta_escolhida)) emotionalToNeutral++;
      });
      if (emotionalToNeutral > 2) controleConsciente = true;
    }

    const avgTime = allAnswers.reduce((acc, a) => acc + a.tempo_resposta_ms, 0) / allAnswers.length;
    let attention = Math.round(Math.max(0, 100 - (avgTime / 5000) * 100));
    if (consistencia > 80) attention += 10;

    const vigilanceTerms = ["Algo te observando", "Vai investigar", "Ameaça", "Sempre", "Hacker", "Algo maior acontecendo", "Calculista"];
    const vigilanceCount = allAnswers.filter((a) => vigilanceTerms.includes(a.resposta_escolhida)).length;
    const perception = Math.min(100, Math.round((vigilanceCount / questions.length) * 100 + 20));

    let reasoning = 70;
    if (avgTime > 1500 && avgTime < 3500) reasoning += 5;

    let xp = 0;
    allAnswers.forEach((a) => {
      if (a.tempo_resposta_ms < 1500) xp += 50;
      else if (a.tempo_resposta_ms < 3000) xp += 30;
      else xp += 10;
    });
    if (consistencia > 90) xp += 200;

    return {
      xp_gain: xp,
      attention: Math.min(100, attention),
      reasoning: Math.min(100, reasoning),
      perception,
      consistency: Math.min(100, consistencia),
      flags: { autoEdicao, controleConsciente },
      finished_at: new Date().toISOString(),
    };
  };

  const finish = (allAnswers: AnswerRecord[]) => {
    setShowTransition(true);

    const previousAttempt = (() => {
      try {
        const raw = localStorage.getItem(`sentinela:analysis:lastAttempt:${userId}`);
        if (!raw) return undefined;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return undefined;
        const ok = parsed.filter(isAnswerRecord);
        return ok.length ? ok : undefined;
      } catch {
        return undefined;
      }
    })();

    const metrics = computeMetrics(allAnswers, previousAttempt);

    try {
      const redoPendingKey = `sentinela:analysis:redoPending:${userId}`;
      const redoPending = localStorage.getItem(redoPendingKey) === "1";
      if (redoPending) {
        localStorage.removeItem(redoPendingKey);
        const redoCountKey = `sentinela:analysis:redoCount:${userId}`;
        const prevRedoCount = Number(localStorage.getItem(redoCountKey) || "0") || 0;
        localStorage.setItem(redoCountKey, String(prevRedoCount + 1));
        metrics.xp_gain = Math.max(0, Math.round(metrics.xp_gain * 0.85));
      }

      const currentXp = Number(localStorage.getItem(`sentinela:xp:${userId}`) || "0") || 0;
      localStorage.setItem(`sentinela:xp:${userId}`, String(currentXp + metrics.xp_gain));
      localStorage.setItem(`sentinela:analysis:lastAttempt:${userId}`, JSON.stringify(allAnswers));
      localStorage.setItem(`sentinela:analysis:lastMetrics:${userId}`, JSON.stringify(metrics));
    } catch {
      void 0;
    }

    setTimeout(() => {
      navigate("/resultado-analise", { state: { xp: metrics.xp_gain, metrics } });
    }, 2200);
  };

  const handleAnswer = (option: string) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const elapsed = Date.now() - startedAtRef.current;
    const responseTime = Math.max(0, elapsed);
    stop();
    cleanupAudio();

    const a: AnswerRecord = {
      pergunta_id: questions[currentStep].id,
      resposta_escolhida: option,
      tempo_resposta_ms: responseTime,
    };

    const nextAnswers = [...answers, a];
    setAnswers(nextAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep((v) => v + 1);
    } else {
      finish(nextAnswers);
    }
  };

  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-[#0A0014] flex items-center justify-center p-8 text-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <p className="text-xl font-light tracking-[0.2em] leading-relaxed text-white/80">
            Você respondeu…
            <br />
            mas não percebeu…
            <br />
            que já começou a ser analisado.
          </p>
          <div className="pt-6">
            <div className="w-12 h-12 border-2 border-[#7A00FF] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentStep];
  const elapsedRatio = clamp(elapsedMs / QUESTION_LIMIT_MS, 0, 1);
  const urgencyColor = timeBarColor(elapsedRatio);
  const buttonColorByText: Record<string, string> = {
    Medo: "#FF4D6D",
    "Algo te observando": "#A855F7",
    Silêncio: "#00E5FF",
    Descanso: "#00FF9C",
  };
  const getOptionColor = (option: string) => {
    const direct = buttonColorByText[option];
    if (direct) return direct;
    const normalized = option
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const byNormalized = buttonColorByText[normalized];
    if (byNormalized) return byNormalized;
    const palette = ["#FF4D6D", "#00E5FF", "#00FF9C", "#A855F7"];
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
    }
    return palette[hash % palette.length];
  };

  return (
    <div className="fixed inset-0 bg-[#0A0014] text-white overflow-hidden">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(122,0,255,0.35)_0%,_transparent_55%)] opacity-30 z-0" />

      <div className="relative z-10 h-[100dvh] w-full">
        <div className="absolute top-0 left-0 right-0 pt-[max(env(safe-area-inset-top,14px),14px)] px-6 z-30 flex flex-col items-center gap-3">
          <div className="relative w-[68px] h-[88px] rounded-[999px] overflow-hidden border border-[#7A00FF]/30 bg-black shadow-[0_0_26px_rgba(122,0,255,0.35)]">
            <video src="/video/ia_avatar.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover scale-110 opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <motion.div
              className="absolute inset-0 rounded-[999px]"
              animate={{ opacity: [0.12, 0.26, 0.12] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ boxShadow: `0 0 30px ${hexToRgba(urgencyColor, 0.35)}` }}
            />
          </div>
        </div>

        <div
          className="absolute top-0 bottom-0 z-40 flex flex-col items-center"
          style={{
            right: "env(safe-area-inset-right, 0px)",
            paddingTop: "max(env(safe-area-inset-top, 14px), 14px)",
            paddingBottom: "max(env(safe-area-inset-bottom, 14px), 14px)",
          }}
        >
          <div className="text-[10px] font-mono tracking-[0.12em] mb-3" style={{ color: "#FF4D6D" }}>
            {formatTimer(elapsedMs)}
          </div>
          <div className="relative h-full w-[6px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-full"
              style={{
                backgroundColor: urgencyColor,
                boxShadow: `0 0 18px ${hexToRgba(urgencyColor, timeExpired ? 0.55 : 0.32)}`,
              }}
              initial={false}
              animate={{ height: `${Math.round(elapsedRatio * 100)}%` }}
              transition={{ duration: 0.08, ease: "linear" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              {questionImageSrc && (
                <img
                  src={questionImageSrc}
                  onError={handleQuestionImageError}
                  alt="Contexto"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/85" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(0,229,255,0.10)_0%,_transparent_60%)]" />
            </div>

            <div className="absolute inset-x-0 top-[max(env(safe-area-inset-top,14px),14px)] pt-[102px] px-6 z-20">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="max-w-md mx-auto"
              >
                <div
                  className="rounded-[1.6rem] backdrop-blur-xl px-5 py-4"
                  style={{
                    background: "rgba(10, 10, 18, 0.18)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: `0 0 24px ${hexToRgba(urgencyColor, 0.08)}, inset 0 1px 0 rgba(255,255,255,0.04)`,
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.35em] text-white/45 font-bold">
                    Pergunta {currentStep + 1}/{questions.length}
                  </div>
                  <div
                    className="mt-2 text-[16px] leading-snug font-semibold text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {q.question}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom,14px),14px)] px-6 z-30">
              <div className="absolute inset-x-0 bottom-0 h-[280px] bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="relative max-w-md mx-auto"
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  {q.options.map((opt, idx) => {
                    const optionColor = getOptionColor(opt);
                    return (
                      <motion.button
                        key={opt}
                        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.05 * idx, duration: 0.22, ease: "easeOut" }}
                        onClick={() => handleAnswer(opt)}
                        disabled={isAnswering}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02 }}
                        className={`group relative rounded-[24px] text-left transition-all ${isAnswering ? "opacity-60" : "opacity-100"}`}
                        style={{
                          background: "rgba(20, 20, 30, 0.34)",
                          backdropFilter: "blur(10px)",
                          border: `1px solid ${hexToRgba(optionColor, 0.22)}`,
                          boxShadow: [
                            `0 10px 34px rgba(0,0,0,0.42)`,
                            `0 0 20px ${hexToRgba(optionColor, 0.18)}`,
                            `inset 0 1px 0 rgba(255,255,255,0.05)`,
                            `inset 0 -10px 18px rgba(0,0,0,0.32)`,
                          ].join(", "),
                        }}
                      >
                        <div
                          className="absolute inset-0 rounded-[24px] opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"
                          style={{ background: hexToRgba(optionColor, 0.06) }}
                        />
                        <div className="px-5 py-3 flex items-center gap-3">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              background: hexToRgba(optionColor, 0.85),
                              boxShadow: `0 0 16px ${hexToRgba(optionColor, 0.55)}`,
                            }}
                          />
                          <div className="text-[13px] font-semibold tracking-wide text-white/92 whitespace-nowrap">{opt}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalisePadroes;
