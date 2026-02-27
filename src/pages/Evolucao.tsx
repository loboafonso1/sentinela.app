import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMockData } from "@/hooks/useMockData";
import { motion } from "framer-motion";
import { TrendingUp, Flame, Target, Award, Shield, Trophy, Lock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import BottomNav from "@/components/BottomNav";
import { aggregates } from "@/hooks/useXpLog";

const Evolucao = () => {
  const navigate = useNavigate();
  const { userData, achievements } = useMockData();
  const [tab, setTab] = useState<"stats" | "conquistas">("stats");
  const [period, setPeriod] = useState<"Dia" | "Semana" | "Mês" | "Ano">("Semana");
  const aggr = aggregates();
  const series = period === "Dia" ? aggr.daySeries : period === "Semana" ? aggr.weekSeries : period === "Mês" ? aggr.monthSeries : aggr.yearSeries;
  const total =
    period === "Dia" ? aggr.dayTotal : period === "Semana" ? aggr.weekTotal : period === "Mês" ? aggr.monthTotal : aggr.yearTotal;

  useEffect(() => {
    if (!localStorage.getItem("sentinela_logged_in")) navigate("/login");
  }, [navigate]);

  const xpPercent = Math.round((userData.xp / userData.xpNextLevel) * 100);
  const arcAngle = (xpPercent / 100) * 180;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-responsive pt-6 pb-2">
        <div className="mx-auto max-w-lg">
          <h1 className="text-xl font-serif font-bold text-foreground">Evolução do Sentinela</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-responsive section-gap">
        {/* Tabs */}
        <div className="flex gap-2">
          {(["stats", "conquistas"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                tab === t ? "bg-gradient-sentinel text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {t === "stats" ? "Estatísticas" : "🏆 Conquistas"}
            </button>
          ))}
        </div>

        {tab === "stats" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Chart */}
            <div className="rounded-3xl border border-border bg-card p-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">Progresso de XP</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(225 15% 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: "hsl(230 22% 12%)", border: "1px solid hsl(230 20% 18%)", borderRadius: "12px", fontSize: "12px" }}
                      labelStyle={{ color: "hsl(220 20% 92%)" }}
                    />
                    <Line type="monotone" dataKey="xp" stroke="hsl(252 70% 60%)" strokeWidth={3} dot={{ fill: "hsl(252 70% 60%)", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
                <p className="text-2xl font-bold text-foreground">{userData.consecutiveDays}</p>
                <p className="text-xs text-muted-foreground mt-1">Dias Consecutivos</p>
                <Flame className="h-8 w-8 text-streak/30 mt-2" />
              </div>
              <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
                <p className="text-2xl font-bold text-foreground">{userData.completionRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Taxa de Conclusão</p>
                <Target className="h-8 w-8 text-primary/30 mt-2" />
              </div>
              <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
                <p className="text-2xl font-bold text-foreground">{userData.totalMissions}</p>
                <p className="text-xs text-muted-foreground mt-1">Total de Missões</p>
                <TrendingUp className="h-8 w-8 text-success/30 mt-2" />
              </div>
              <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
                <p className="text-2xl font-bold text-foreground">{userData.level}</p>
                <p className="text-xs text-muted-foreground mt-1">Nível Atual</p>
                <Shield className="h-8 w-8 text-sentinel-light/30 mt-2" />
              </div>
            </div>

            {/* Period Selector */}
            <div className="rounded-3xl border border-border bg-card p-card">
              <h3 className="text-sm font-semibold text-foreground mb-3">Desempenho por Período</h3>
              <div className="flex gap-2 mb-4">
                {(["Dia", "Semana", "Mês", "Ano"] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      period === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="text-center text-2xl font-bold text-foreground">{total} XP</p>
              <p className="text-center text-xs text-muted-foreground">acumulado no período</p>
            </div>

            {/* Semicircle Progress */}
            <div className="rounded-3xl border border-border bg-card p-card text-center">
              <h3 className="text-sm font-semibold text-foreground mb-4">Próximo Nível</h3>
              <div className="relative mx-auto w-48 h-28 overflow-hidden">
                <svg viewBox="0 0 200 110" className="w-full h-full">
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--secondary))" strokeWidth="12" strokeLinecap="round" />
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none" stroke="hsl(var(--primary))" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${(arcAngle / 180) * 251.2} 251.2`}
                  />
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-xl font-bold text-foreground">{xpPercent}%</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{userData.xp} / {userData.xpNextLevel} XP</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`rounded-2xl border p-3 sm:p-4 flex items-center gap-4 ${
                  a.unlocked ? "border-primary/30 bg-card" : "border-border bg-card/50 opacity-60"
                }`}
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl ${
                  a.unlocked ? "bg-primary/15" : "bg-secondary"
                }`}>
                  {a.unlocked ? a.icon : <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                  {a.unlockedAt && <p className="text-[10px] text-primary mt-0.5">Desbloqueada</p>}
                </div>
                {a.unlocked && <Trophy className="h-4 w-4 text-primary shrink-0" />}
              </div>
            ))}
          </motion.div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Evolucao;
