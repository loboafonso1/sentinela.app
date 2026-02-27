import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMockData } from "@/hooks/useMockData";
import { useDailyQuiz } from "@/hooks/useDailyQuiz";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Clock, ChevronRight, Zap, Flame, Star } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import MindShieldVisual from "@/components/MindShieldVisual";
import FavoriteButton from "@/components/FavoriteButton";

const TRAINING_DURATION = 15 * 60; // 15 minutes in seconds

const Treino = () => {
  const navigate = useNavigate();
  const { userData, completeMission } = useMockData();
  const quiz = useDailyQuiz();
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TRAINING_DURATION);
  const [completed, setCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("sentinela_logged_in")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const autostart = localStorage.getItem("sentinela_autostart_treino") === "true";
    if (autostart && !userData.todayCompleted) setStarted(true);
  }, [userData.todayCompleted]);

  useEffect(() => {
    if (!started || completed) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, completed]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleFinish = useCallback(() => {
    setCompleted(true);
    completeMission(Math.round((quiz.score / Math.max(quiz.total, 1)) * 3)); // use score as quiz_score (0-3 approx)
    setTimeout(() => setShowReward(true), 300);
  }, [completeMission, quiz.score, quiz.total]);

  const progressPercent = ((TRAINING_DURATION - timeLeft) / TRAINING_DURATION) * 100;

  if (userData.todayCompleted && !completed) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center px-5">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-sm">
          <div className="h-20 w-20 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto">
            <Clock className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-serif font-bold text-foreground">Treino de Hoje Concluído</h2>
          <p className="text-sm text-muted-foreground">O crescimento acontece na constância. Volte amanhã para continuar sua evolução.</p>
          <Button onClick={() => navigate("/dashboard")} className="bg-gradient-sentinel text-primary-foreground rounded-2xl px-8 py-5">
            Voltar ao Início
          </Button>
        </motion.div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center px-5"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center space-y-6 max-w-sm"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: 2, duration: 0.5 }}>
                <div className="h-24 w-24 rounded-3xl bg-gradient-sentinel flex items-center justify-center mx-auto shadow-premium">
                  <Star className="h-12 w-12 text-primary-foreground" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-serif font-bold text-foreground">Missão Concluída!</h2>
              <div className="flex items-center justify-center gap-2 text-xl font-bold text-primary">
                <Zap className="h-6 w-6" />
                +100 XP
              </div>
              <div className="flex items-center justify-center gap-2 text-streak">
                <Flame className="h-5 w-5" />
                <span className="font-semibold">Sequência: {userData.streak + 1} dias</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Examinai tudo. Retende o bem." — 1 Ts 5:21
              </p>
              <Button onClick={() => navigate("/dashboard")} className="bg-gradient-sentinel text-primary-foreground rounded-2xl px-8 py-5 w-full">
                Continuar <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-responsive pt-6 pb-4">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">Treinamento Sentinela</span>
            </div>
            <FavoriteButton itemId="treino-diario" />
          </div>
          <h1 className="text-xl font-serif font-bold text-foreground">15 Minutos de Discernimento</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-responsive section-gap">
        {!started ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-gap">
            <div className="rounded-3xl border border-border bg-card p-card-lg text-center space-y-4">
              <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
                <Clock className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-serif font-bold text-foreground text-xl sm:text-2xl">15:00</h2>
              <p className="text-sm text-muted-foreground">Dedique 15 minutos para fortalecer seu discernimento bíblico.</p>
            </div>
            <Button onClick={() => setStarted(true)} className="w-full bg-gradient-sentinel text-primary-foreground font-semibold py-btn rounded-2xl shadow-sentinel text-base">
              Iniciar Treinamento <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
            <div className="rounded-3xl border border-border bg-card p-card">
              <h3 className="text-sm font-semibold text-foreground mb-2">Blindagem da Mente</h3>
              <p className="text-xs text-muted-foreground mb-4">Proteção, clareza e resistência à desinformação.</p>
              <MindShieldVisual className="mx-auto" />
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-gap">
            {/* Timer */}
            <div className="rounded-3xl border border-border bg-card p-card-lg text-center space-y-4">
              <div className="relative mx-auto h-32 w-32">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="hsl(var(--primary))" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPercent / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span>{quiz.index}/{quiz.total} questões</span>
                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/50" />
                <span>Pontuação: {quiz.score}</span>
              </div>
            </div>

            {/* Quiz area */}
            <div className="rounded-3xl border border-border bg-card p-card space-y-4">
              {!quiz.current && !quiz.completed && (
                <p className="text-sm text-muted-foreground">Carregando questões...</p>
              )}
              {quiz.current && (
                <>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{quiz.current.category}</p>
                    <h3 className="text-base font-semibold text-foreground">{quiz.current.question}</h3>
                  </div>
                  <div className="space-y-2">
                    {quiz.current.options.map((opt, idx) => {
                      const already = quiz.answers[quiz.index] !== -1;
                      const isSelected = quiz.answers[quiz.index] === idx;
                      const isCorrect = idx === quiz.current!.correctIndex;
                      const style =
                        already
                          ? isCorrect
                            ? "border-success/50 bg-success/10"
                            : isSelected
                              ? "border-destructive/50 bg-destructive/10"
                              : "border-border"
                          : "border-border hover:border-primary/50";
                      return (
                        <button
                          key={idx}
                          onClick={() => quiz.answer(idx)}
                          disabled={already}
                          className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${style}`}
                          aria-pressed={isSelected}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {quiz.completed && (
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-serif font-bold text-foreground">Treino concluído</h3>
                  <p className="text-sm text-muted-foreground">Você acertou {quiz.score} de {quiz.total} questões.</p>
                </div>
              )}
            </div>

            {(quiz.completed || timeLeft === 0) ? (
              <Button
                onClick={handleFinish}
                className="w-full bg-gradient-sentinel text-primary-foreground font-semibold py-btn rounded-2xl shadow-sentinel text-base"
              >
                Finalizar Missão <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={() => quiz.skip()}
                className="w-full bg-gradient-sentinel text-primary-foreground font-semibold py-btn rounded-2xl shadow-sentinel text-base"
              >
                Pular <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            )}
            <div className="rounded-3xl border border-border bg-card p-card">
              <h3 className="text-sm font-semibold text-foreground mb-2">Blindagem da Mente</h3>
              <p className="text-xs text-muted-foreground mb-4">Proteção, clareza e resistência à desinformação.</p>
              <MindShieldVisual className="mx-auto" />
            </div>
          </motion.div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Treino;
