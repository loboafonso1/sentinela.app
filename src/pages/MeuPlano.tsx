import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Trophy, BarChart3, Shield, Target } from "lucide-react";

const MeuPlano = () => {
  const { completedCount, totalModules, overallProgress, getLevel, getStreak, progress } = useModuleProgress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("sentinela_user_name")) navigate("/login");
  }, [navigate]);

  const level = getLevel();
  const streak = getStreak();
  const totalQuizScore = progress.filter(p => p.completed && p.quiz_score !== null).reduce((sum, p) => sum + (p.quiz_score || 0), 0);
  const totalQuizQuestions = completedCount * 3;
  const accuracy = totalQuizQuestions > 0 ? Math.round((totalQuizScore / totalQuizQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto max-w-lg flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></button>
          <span className="font-serif font-semibold text-foreground">Relatório de Discernimento</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 glow-sentinel">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gradient-sentinel">{level}</h1>
          <p className="text-sm text-muted-foreground">Seu nível atual de discernimento</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <BarChart3 className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Ensinos Analisados</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <Target className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Taxa de Acertos</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <Flame className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">Dias Consecutivos</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{level.split(" ")[0]}</p>
            <p className="text-xs text-muted-foreground">Nível Atual</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Evolução do Discernimento</span>
            <span className="text-primary font-semibold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 bg-secondary [&>div]:bg-gradient-sentinel" />
        </div>

        <div className="rounded-2xl border border-sentinel bg-card p-5 shadow-sentinel text-center">
          <p className="text-sm text-foreground italic">"Examinai tudo. Retende o bem."</p>
          <p className="text-xs text-muted-foreground mt-2">1 Tessalonicenses 5:21</p>
        </div>
      </main>
    </div>
  );
};

export default MeuPlano;
