import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMockData } from "@/hooks/useMockData";
import { useWeeklyFromProgress } from "@/hooks/useWeeklyFromProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Shield, Flame, Target, TrendingUp, ChevronRight, Zap, CheckCircle2, User } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import WeeklyBars from "@/components/WeeklyBars";

const Dashboard = () => {
  const { userData } = useMockData();
  const weeklyData = useWeeklyFromProgress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("sentinela_logged_in")) navigate("/login");
  }, [navigate]);

  const xpPercent = Math.round((userData.xp / userData.xpNextLevel) * 100);
  const getCtaLabel = () => {
    if (userData.todayCompleted) return "Concluído Hoje";
    try {
      const raw = localStorage.getItem("sentinela_daily_quiz");
      if (!raw) return "Iniciar Treinamento";
      const s = JSON.parse(raw) as { dateKey: string; index: number; answers: number[] };
      const today = new Date().toISOString().slice(0, 10);
      const inProgress = s.dateKey === today && s.index > 0 && s.index < (s.answers?.length ?? 0);
      return inProgress ? "Continuar Treino" : "Iniciar Treinamento";
    } catch {
      return "Iniciar Treinamento";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-responsive pt-6 pb-4">
        <div className="mx-auto max-w-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-sentinel flex items-center justify-center shadow-sentinel">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bem-vindo de volta</p>
              <h2 className="text-base font-semibold text-foreground">{userData.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full">
            <Flame className="h-4 w-4 text-streak" />
            <span className="text-sm font-bold text-foreground">{userData.streak}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-responsive section-gap">
        {/* Daily Mission Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-sentinel p-card shadow-premium"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-foreground/80" />
              <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">Treinamento Diário</span>
            </div>
            {userData.todayCompleted && (
              <span className="flex items-center gap-1 text-xs text-primary-foreground bg-primary-foreground/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" /> Concluído
              </span>
            )}
          </div>
          <h3 className="text-lg font-serif font-bold text-primary-foreground mb-1">Missão de Hoje</h3>
          <p className="text-sm text-primary-foreground/70 mb-4">Fortaleça seu discernimento espiritual</p>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-primary-foreground/70 mb-1">
              <span>Progresso</span>
              <span>{userData.todayCompleted ? "100%" : "0%"}</span>
            </div>
            <div className="h-2 rounded-full bg-primary-foreground/20">
              <div
                className="h-full rounded-full bg-primary-foreground transition-all"
                style={{ width: userData.todayCompleted ? "100%" : "0%" }}
              />
            </div>
          </div>
          <Button
            onClick={() => navigate("/treino")}
            disabled={userData.todayCompleted}
            className="w-full bg-primary-foreground text-primary font-semibold py-btn rounded-2xl hover:bg-primary-foreground/90"
          >
            {getCtaLabel()}
            {!userData.todayCompleted && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </motion.div>

        {/* XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-border bg-card p-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">Evolução XP</span>
            </div>
            <span className="text-xs text-muted-foreground">{userData.level}</span>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-foreground">{userData.xp}</span>
            <span className="text-xs text-muted-foreground">/ {userData.xpNextLevel} XP</span>
          </div>
          <Progress value={xpPercent} className="h-2.5 bg-secondary [&>div]:bg-gradient-sentinel" />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-2.5 sm:gap-3"
        >
          <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 text-center">
            <Flame className="h-5 w-5 text-streak mx-auto mb-1.5" />
            <p className="text-xl font-bold text-foreground">{userData.consecutiveDays}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Dias Consecutivos</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 text-center">
            <Target className="h-5 w-5 text-primary mx-auto mb-1.5" />
            <p className="text-xl font-bold text-foreground">{userData.totalMissions}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Total Missões</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 text-center">
            <Shield className="h-5 w-5 text-sentinel-light mx-auto mb-1.5" />
            <p className="text-lg font-bold text-foreground">{userData.level}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Nível Atual</p>
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-border bg-card p-card"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Atividade Semanal</h3>
          <WeeklyBars data={weeklyData} minHeight={96} />
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
