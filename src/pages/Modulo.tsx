import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { modules } from "@/data/modules";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

const Modulo = () => {
  const { dia } = useParams<{ dia: string }>();
  const day = parseInt(dia || "1");
  const mod = modules.find((m) => m.day === day);
  const navigate = useNavigate();
  const { isModuleUnlocked, completeModule, progress } = useModuleProgress();

  const [step, setStep] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("sentinela_user_name")) navigate("/login");
  }, [navigate]);

  if (!mod) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Módulo não encontrado</p></div>;

  const alreadyCompleted = progress.find((p) => p.module_day === day && p.completed);
  const unlocked = isModuleUnlocked(day);

  if (!unlocked && !alreadyCompleted) {
    navigate("/dashboard");
    return null;
  }

  const totalSteps = 5;
  const stepProgress = ((step + 1) / totalSteps) * 100;

  const handleQuizAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === mod.quiz[quizIndex].correctIndex) setScore((s) => s + 1);
  };

  const handleQuizNext = () => {
    if (quizIndex < mod.quiz.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setStep(4);
    }
  };

  const handleComplete = async () => {
    await completeModule(day, score);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto max-w-lg flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Dia {mod.day}</p>
            <p className="text-sm font-serif font-semibold text-foreground">{mod.title}</p>
          </div>
          <div className="text-xs text-primary font-medium">{step + 1}/{totalSteps}</div>
        </div>
        <div className="mx-auto max-w-lg mt-2">
          <Progress value={stepProgress} className="h-1 bg-secondary [&>div]:bg-gradient-sentinel" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="situation" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">Etapa 1 · Situação Moderna</p>
                <h2 className="text-xl font-serif font-bold text-foreground">{mod.situation.title}</h2>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-foreground leading-relaxed">{mod.situation.content}</p>
              </div>
              <Button onClick={() => setStep(1)} className="w-full bg-gradient-sentinel text-primary-foreground font-semibold rounded-xl">
                Continuar <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="biblical" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">Etapa 2 · Texto Bíblico</p>
                <h2 className="text-xl font-serif font-bold text-foreground">{mod.biblical.reference}</h2>
              </div>
              <div className="rounded-2xl border border-sentinel bg-card p-5 space-y-4">
                <blockquote className="text-sm text-foreground italic leading-relaxed border-l-2 border-primary pl-4">
                  "{mod.biblical.passage}"
                </blockquote>
                <div className="space-y-2">
                  <p className="text-xs text-primary font-semibold uppercase">Contexto Histórico</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mod.biblical.context}</p>
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full bg-gradient-sentinel text-primary-foreground font-semibold rounded-xl">
                Continuar <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="comparison" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">Etapa 3 · Comparação</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-2">
                  <p className="text-xs text-primary font-semibold uppercase flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Interpretação Correta</p>
                  <p className="text-sm text-foreground leading-relaxed">{mod.comparison.correct}</p>
                </div>
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 space-y-2">
                  <p className="text-xs text-destructive font-semibold uppercase flex items-center gap-1"><XCircle className="h-3 w-3" /> Interpretação Distorcida</p>
                  <p className="text-sm text-foreground leading-relaxed">{mod.comparison.distortion}</p>
                </div>
              </div>
              <Button onClick={() => setStep(3)} className="w-full bg-gradient-sentinel text-primary-foreground font-semibold rounded-xl">
                Ir para o Mini Teste <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">Etapa 4 · Mini Teste</p>
                <p className="text-sm text-muted-foreground">Pergunta {quizIndex + 1} de {mod.quiz.length}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">{mod.quiz[quizIndex].question}</h3>
                <div className="space-y-2">
                  {mod.quiz[quizIndex].options.map((opt, i) => {
                    let cls = "border-border bg-secondary hover:border-primary";
                    if (showFeedback) {
                      if (i === mod.quiz[quizIndex].correctIndex) cls = "border-primary bg-primary/10";
                      else if (i === selectedAnswer) cls = "border-destructive bg-destructive/10";
                      else cls = "border-border bg-secondary opacity-50";
                    }
                    return (
                      <button key={i} onClick={() => handleQuizAnswer(i)} disabled={showFeedback} className={`w-full rounded-xl border p-3 text-left text-sm text-foreground transition-all ${cls}`}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                    <p className="text-xs text-primary font-semibold mb-1">
                      {selectedAnswer === mod.quiz[quizIndex].correctIndex ? "✓ Correto!" : "✗ Incorreto"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{mod.quiz[quizIndex].explanation}</p>
                  </motion.div>
                )}
              </div>
              {showFeedback && (
                <Button onClick={handleQuizNext} className="w-full bg-gradient-sentinel text-primary-foreground font-semibold rounded-xl">
                  {quizIndex < mod.quiz.length - 1 ? "Próxima Pergunta" : "Ver Conclusão"} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="conclusion" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 glow-sentinel">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-serif font-bold text-foreground">Treino Concluído!</h2>
                <p className="text-sm text-muted-foreground">Você acertou <span className="text-primary font-bold">{score}</span> de {mod.quiz.length} perguntas</p>
                <p className="text-sm text-primary font-medium">Hoje você fortaleceu seu discernimento.</p>
              </div>
              <div className="rounded-2xl border border-sentinel bg-card p-6 shadow-sentinel">
                <p className="text-sm text-foreground italic leading-relaxed">{mod.conclusion}</p>
              </div>
              <Button onClick={handleComplete} className="bg-gradient-sentinel text-primary-foreground font-semibold px-8 rounded-xl">
                Voltar ao Dashboard <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Modulo;
