import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Zap, Shield, TrendingUp, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { useMockData } from "@/hooks/useMockData";

const Resumo = () => {
  const navigate = useNavigate();
  const { userData } = useMockData();
  const xpPercent = Math.round((userData.xp / userData.xpNextLevel) * 100);

  useEffect(() => {
    if (!localStorage.getItem("sentinela_logged_in")) navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-responsive pt-6 pb-2">
        <div className="mx-auto max-w-lg">
          <h1 className="text-xl font-serif font-bold text-foreground">Resumo</h1>
          <p className="text-xs text-muted-foreground">Sua situação e desenvolvimento</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-responsive section-gap">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-card p-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">Evolução Geral</span>
            </div>
            <span className="text-xs text-muted-foreground">Nível {userData.level}</span>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-foreground">{userData.xp}</span>
            <span className="text-xs text-muted-foreground">/ {userData.xpNextLevel} XP</span>
          </div>
          <Progress value={xpPercent} className="h-2.5 bg-secondary [&>div]:bg-gradient-sentinel" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2.5 sm:gap-3"
        >
          <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 text-center">
            <Flame className="h-5 w-5 text-streak mx-auto mb-1.5" />
            <p className="text-xl font-bold text-foreground">{userData.streak}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Sequência</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 text-center">
            <Zap className="h-5 w-5 text-primary mx-auto mb-1.5" />
            <p className="text-xl font-bold text-foreground">{userData.totalMissions}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Missões</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 text-center">
            <Shield className="h-5 w-5 text-sentinel-light mx-auto mb-1.5" />
            <p className="text-lg font-bold text-foreground">{userData.level}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Nível</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-card p-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Próximas Conquistas</span>
          </div>
          <ul className="space-y-2">
            <li className="rounded-xl border border-border p-3 flex items-center justify-between">
              <span className="text-sm text-foreground">3 dias seguidos</span>
              <span className="text-xs text-muted-foreground">Progresso: {Math.min(userData.streak, 3)}/3</span>
            </li>
            <li className="rounded-xl border border-border p-3 flex items-center justify-between">
              <span className="text-sm text-foreground">200 XP ganhos</span>
              <span className="text-xs text-muted-foreground">{userData.xp}/200</span>
            </li>
          </ul>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Resumo;
