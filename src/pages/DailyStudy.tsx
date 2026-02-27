import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, PlayCircle, Flame, Zap, Shield, FileText, LineChart } from "lucide-react";
import { useMockData } from "@/hooks/useMockData";
import { dailyVideos } from "@/data/media";
import VideoModal from "@/components/VideoModal";
import ProgressDashboardRing from "@/components/ProgressDashboardRing";
import DailyQuiz, { QuizQuestion } from "@/components/DailyQuiz";
import { useCountdown } from "@/hooks/useCountdown";

const TOTAL_DAYS = 30;
const unlockedDay = 1;
const DAYS = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);
const lessons: { day: number; title: string }[] = [
  { day: 1, title: "Como o erro começa silenciosamente" },
  { day: 2, title: "O que é discernimento verdadeiro" },
  { day: 3, title: "Sinais iniciais de distorção doutrinária" },
  { day: 4, title: "A diferença entre opinião e heresia" },
  { day: 5, title: "Por que bons cristãos são enganados" },
  { day: 6, title: "Falsas autoridades e apelos emocionais" },
  { day: 7, title: "Textos fora de contexto" },
  { day: 8, title: "Tradições versus Escritura" },
  { day: 9, title: "O evangelho diluído" },
  { day: 10, title: "Meias verdades que desviam" },
  { day: 11, title: "Testando espíritos e mensagens" },
  { day: 12, title: "A pressão do grupo" },
  { day: 13, title: "Retórica sedutora" },
  { day: 14, title: "Milagres e sinais: critérios bíblicos" },
  { day: 15, title: "Prosperidade e promessas fáceis" },
  { day: 16, title: "Relativismo moral moderno" },
  { day: 17, title: "O perigo do sincretismo" },
  { day: 18, title: "Ideologias travestidas de fé" },
  { day: 19, title: "A voz da consciência cativa" },
  { day: 20, title: "Hermenêutica básica aplicada" },
  { day: 21, title: "Doutrinas centrais inegociáveis" },
  { day: 22, title: "Unidade sem concessões" },
  { day: 23, title: "Liderança e prestação de contas" },
  { day: 24, title: "Identificando lobos entre o rebanho" },
  { day: 25, title: "Guardando o coração e a mente" },
  { day: 26, title: "Disciplina e constância diária" },
  { day: 27, title: "Debates com mansidão e firmeza" },
  { day: 28, title: "Fortalecendo a comunidade local" },
  { day: 29, title: "Vigiando até o fim" },
  { day: 30, title: "Tornando-se um Sentinela" },
];

const DailyStudy = () => {
  const navigate = useNavigate();
  const { userData } = useMockData();
  const [tab, setTab] = useState<"video" | "aulas" | "progresso">("video");
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoCompleted, setVideoCompleted] = useState<boolean>(() => localStorage.getItem("sent_video_day1_done") === "true");
  const [quizCompleted, setQuizCompleted] = useState<boolean>(() => localStorage.getItem("sent_quiz_day1_done") === "true");
  const [nextUnlockAt, setNextUnlockAt] = useState<number | null>(() => {
    const v = localStorage.getItem("sentinela_next_unlock_at");
    return v ? Number(v) : null;
  });
  const [finalizing, setFinalizing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("sentinela_logged_in")) navigate("/login");
  }, [navigate]);

  const { formatted: countdownFmt, expired: countdownExpired } = useCountdown(nextUnlockAt);
  const lastCompletedDay = Number(localStorage.getItem("sentinela_last_completed_day") ?? "0") || 0;
  const effectiveUnlockedDay = lastCompletedDay >= 1 ? (countdownExpired ? Math.max(unlockedDay, lastCompletedDay + 1) : Math.max(unlockedDay, lastCompletedDay)) : unlockedDay;
  const currentVideo = dailyVideos[effectiveUnlockedDay - 1] ?? dailyVideos[0];
  const strategicTitles: Record<number, string> = {
    1: "Dia 1 — Como o erro começa silenciosamente",
  };
  const displayTitle = strategicTitles[unlockedDay] ?? currentVideo.title;
  const extractYouTubeId = (url: string): string | null => {
    const r =
      /(?:youtube\.com\/.*(?:\?|&)v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const m = url.match(r);
    return m ? m[1] : null;
  };
  const lastOpenRef = useRef<number | null>(null);
  const openVideo = (url: string) => {
    const id = extractYouTubeId(url) ?? "dQw4w9WgXcQ";
    setVideoId(id);
    setIsVideoOpen(true);
    lastOpenRef.current = Date.now();
  };
  type UserLike = { xp?: number; level?: number; xpNextLevel?: number; avatarUrl?: string };
  const ud = userData as unknown as UserLike;
  const level = ud?.level ?? 1;
  const xpPercentCalc = (() => {
    const xp = Number(ud?.xp ?? 0);
    const next = Number(ud?.xpNextLevel ?? 100);
    if (next <= 0) return 0;
    const v = Math.max(0, Math.min(100, Math.round((xp / next) * 100)));
    return v;
  })();
  const mockStored = Number(localStorage.getItem("sent_mock_percent") ?? "NaN");
  const progressPercent = Number.isFinite(xpPercentCalc) && xpPercentCalc > 0 ? xpPercentCalc : Number.isFinite(mockStored) ? mockStored : 0;
  const levelLabel =
    level >= 10 ? "Nível Avançado" : level >= 5 ? "Nível Intermediário" : "Nível Iniciante";
  const supabaseAvatar = (() => {
    try {
      const raw = localStorage.getItem("supabase.auth.token");
      if (!raw) return null;
      const data = JSON.parse(raw);
      return (
        data?.currentSession?.user?.user_metadata?.avatar_url ||
        data?.user?.user_metadata?.avatar_url ||
        null
      );
    } catch {
      return null;
    }
  })();
  const avatarUrl = ud?.avatarUrl || supabaseAvatar || localStorage.getItem("sentinela_avatar") || undefined;

  const getNextLocalMidnight = () => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0, 0, 0).getTime();
  };

  const resetSimulation = () => {
    localStorage.removeItem("sent_video_day1_done");
    localStorage.removeItem("sent_quiz_day1_done");
    localStorage.removeItem("sent_mock_percent");
    localStorage.removeItem("sentinela_next_unlock_at");
    localStorage.removeItem("sentinela_last_completed_day");
    localStorage.setItem("sentinela_logged_in", "true");
    setVideoCompleted(false);
    setQuizCompleted(false);
    setNextUnlockAt(null);
    setTab("video");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVideoClose = () => {
    setIsVideoOpen(false);
    setVideoCompleted(true);
    setQuizCompleted(false);
    localStorage.setItem("sent_video_day1_done", "true");
    localStorage.setItem("sent_quiz_day1_done", "false");
    setTab("aulas");
  };
  useEffect(() => {
    if (!isVideoOpen && lastOpenRef.current && !videoCompleted) {
      setVideoCompleted(true);
      setQuizCompleted(false);
      localStorage.setItem("sent_video_day1_done", "true");
      localStorage.setItem("sent_quiz_day1_done", "false");
      setTab("aulas");
      lastOpenRef.current = null;
    }
  }, [isVideoOpen, videoCompleted]);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const fresh = url.searchParams.get("startFresh");
      if (fresh === "1" || window.location.hash === "#reset") {
        resetSimulation();
      }
    } catch {
      /* noop */
    }
  }, []);

  const onQuizComplete = () => {
    setQuizCompleted(true);
    localStorage.setItem("sent_quiz_day1_done", "true");
    localStorage.setItem("sent_mock_percent", "100");
  };

  const finalizeDay = () => {
    setFinalizing(true);
    const target = getNextLocalMidnight();
    localStorage.setItem("sentinela_next_unlock_at", String(target));
    localStorage.setItem("sentinela_last_completed_day", "1");
    setNextUnlockAt(target);
    setTimeout(() => setFinalizing(false), 700);
  };

  const day1Questions: QuizQuestion[] = [
    {
      question: "Como devemos testar um ensino?",
      options: ["Pela emoção", "Pela maioria", "Conferindo nas Escrituras", "Pelo carisma"],
      correctIndex: 2,
      verseRef: "Atos 17:11",
      verseText: "Examinavam as Escrituras todos os dias…",
    },
    {
      question: "O que acontece quando alguém prega outro evangelho?",
      options: ["É aceitável", "Deve ser ignorado", "Deve ser rejeitado", "Depende do contexto"],
      correctIndex: 2,
      verseRef: "Gálatas 1:8",
      verseText: "Se alguém pregar outro evangelho…",
    },
    {
      question: "Qual atitude protege contra o engano?",
      options: ["Curiosidade sem filtro", "Vigilância e sobriedade", "Seguir tendências", "Evitar estudar"],
      correctIndex: 1,
      verseRef: "1 Pedro 5:8",
      verseText: "Sede sóbrios e vigilantes…",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-responsive pt-6 pb-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
            <div>
              <h1 className="text-xl font-serif font-extrabold tracking-wide text-foreground">
                Centro de Treinamento Sentinela
              </h1>
              <p className="text-xs text-muted-foreground">
                15 minutos diários para fortalecer seu discernimento.
              </p>
              {/* Tabs dentro do cabeçalho (coluna esquerda) */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setTab("video")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    tab === "video" ? "bg-primary/15 border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Vídeo
                </button>
                <button
                  onClick={() => setTab("aulas")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    tab === "aulas" ? "bg-primary/15 border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Aulas
                </button>
                <button
                  onClick={() => setTab("progresso")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    tab === "progresso" ? "bg-primary/15 border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Progresso
                </button>
              </div>
              {/* Badge "Liberado hoje" abaixo das tabs */}
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                  🟣 Liberado hoje
                </span>
              </div>
            </div>
            {/* Coluna direita: ProgressDashboardRing fazendo parte do layout */}
            <div className="justify-self-center md:justify-self-end w-fit">
              <ProgressDashboardRing
                percent={progressPercent}
                levelLabel={levelLabel}
                avatarUrl={avatarUrl}
                size="md"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-responsive section-gap">
        {/* Header grid move: tabs e badge já estão no header; vídeo começa abaixo */}

        {tab === "video" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative">
            <button
              onClick={() => openVideo(currentVideo.url)}
              className="group w-full text-left rounded-3xl border border-border bg-card p-card shadow-premium"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-white/90 drop-shadow transition-transform duration-200 ease-out group-hover:scale-105" />
                </div>
                <div className="absolute left-4 bottom-4 rounded-xl bg-background/85 border border-border px-3 py-2 text-xs">
                  <p className="font-semibold text-foreground">{displayTitle}</p>
                  <p className="text-[11px] text-muted-foreground">Treinamento de 15 minutos</p>
                </div>
              </div>
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Complete hoje para manter sua sequência ativa.
          </p>
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Jornada — 30 Dias</h2>
              <button
                onClick={() => {
                  localStorage.removeItem("sent_video_day1_done");
                  localStorage.removeItem("sent_quiz_day1_done");
                  localStorage.removeItem("sent_mock_percent");
                  localStorage.removeItem("sentinela_next_unlock_at");
                  localStorage.removeItem("sentinela_last_completed_day");
                  setVideoCompleted(false);
                  setQuizCompleted(false);
                  setNextUnlockAt(null);
                  setTab("video");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="ml-auto rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40"
                title="Resetar simulação"
              >
                Resetar simulação
              </button>
            </div>
            <div className="rounded-3xl border border-border bg-card p-card space-y-2">
              {DAYS.map((d) => {
                const unlocked = d <= effectiveUnlockedDay;
                const t = lessons[d - 1]?.title ?? "Aula";
                return (
                  <div
                    key={d}
                    className={`rounded-2xl border p-4 flex items-center justify-between transition-all ${
                      unlocked ? "bg-card hover:border-primary/40" : "bg-muted/30 border-border opacity-70"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">Dia {d} de {TOTAL_DAYS} — {t}</p>
                      <p className="text-xs text-muted-foreground">Duração ~ 15 min</p>
                    </div>
                    {d === effectiveUnlockedDay ? (
                      <button
                        onClick={() => openVideo(dailyVideos[d - 1]?.url ?? "")}
                        className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium py-2 px-3 hover:opacity-95"
                      >
                        Assistir agora
                      </button>
                    ) : unlocked ? (
                      <span className="text-xs text-muted-foreground">Liberado</span>
                    ) : (
                      <>
                        {d === effectiveUnlockedDay + 1 && nextUnlockAt && !countdownExpired ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Lock className="h-3.5 w-3.5" />
                            <span>Bloqueado — libera em {countdownFmt}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Lock className="h-3.5 w-3.5" />
                            <span>Bloqueado — libera amanhã</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
        )}

        {tab === "aulas" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Jornada — 30 Dias</h2>
            <button
              onClick={resetSimulation}
              className="ml-auto rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40"
              title="Resetar simulação"
            >
              Resetar simulação
            </button>
          </div>
          <div className="mb-4">
            {!videoCompleted && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                Assista a aula de hoje para desbloquear o quiz.
              </div>
            )}
            {videoCompleted && !quizCompleted && (
              <DailyQuiz
                questions={day1Questions}
                onComplete={onQuizComplete}
                onStepCorrect={(idx) => {
                  const total = day1Questions.length;
                  const target = Math.min(100, Math.round(((idx + 1) / total) * 100));
                  localStorage.setItem("sent_mock_percent", String(target));
                }}
              />
            )}
            {videoCompleted && quizCompleted && (
              <div className="space-y-3">
                <button
                  onClick={finalizeDay}
                  disabled={finalizing || !!nextUnlockAt}
                  className={`w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold py-3 px-4 shadow-lg transition ${finalizing ? "opacity-80" : "hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]"}`}
                >
                  {finalizing ? "Concluindo..." : "Concluir treino de hoje"}
                  <span className="ml-2 text-white/80 text-xs">Desbloquear o próximo dia</span>
                </button>
                {nextUnlockAt && !countdownExpired && (
                  <div className="rounded-2xl border border-border bg-card p-3 text-center text-xs text-muted-foreground">
                    Próxima aula disponível em: <span className="font-semibold text-foreground">{countdownFmt}</span>
                  </div>
                )}
                {nextUnlockAt && countdownExpired && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-foreground">
                    ✅ Treino concluído. Próxima aula liberada.
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-border bg-card p-card space-y-2">
            {DAYS.map((d) => {
              const unlocked = d <= effectiveUnlockedDay;
              const t = lessons[d - 1]?.title ?? "Aula";
              return (
                <div
                  key={d}
                  className={`rounded-2xl border p-4 flex items-center justify-between transition-all ${
                    unlocked ? "bg-card hover:border-primary/40" : "bg-muted/30 border-border opacity-70"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">Dia {d} de {TOTAL_DAYS} — {t}</p>
                    <p className="text-xs text-muted-foreground">Duração ~ 15 min</p>
                  </div>
                  {d === effectiveUnlockedDay ? (
                    <button
                      onClick={() => openVideo(dailyVideos[d - 1]?.url ?? "")}
                      className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium py-2 px-3 hover:opacity-95"
                    >
                      Assistir agora
                    </button>
                  ) : unlocked ? (
                    <span className="text-xs text-muted-foreground">Liberado</span>
                  ) : (
                    <>
                      {d === effectiveUnlockedDay + 1 && nextUnlockAt && !countdownExpired ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="h-3.5 w-3.5" />
                          <span>Bloqueado — libera em {countdownFmt}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="h-3.5 w-3.5" />
                          <span>Bloqueado — libera amanhã</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
        )}

        {tab === "progresso" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Estudos do dia</h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-streak" />
                <span>{userData?.streak ?? 0} sequência</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-primary" />
                <span>{userData?.xp ?? 0} pontos</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-sentinel-light" />
                <span>Nível {userData?.level ?? 1}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-card space-y-2">
            {DAYS.map((d) => {
              const unlocked = d <= effectiveUnlockedDay;
              return (
                <div
                  key={d}
                  className={`rounded-2xl border p-4 transition-all ${
                    unlocked ? "bg-card hover:border-primary/40" : "bg-muted/30 border-border opacity-70"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground mb-1">Dia {d}</p>
                  {unlocked ? (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Concluído: 0%</span>
                      <span>Duração ~ 15 min</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3.5 w-3.5" />
                      <span>Bloqueado — libera amanhã</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
        )}
      </main>
      <VideoModal open={isVideoOpen} videoId={videoId ?? "dQw4w9WgXcQ"} onClose={handleVideoClose} />
    </div>
  );
};

export default DailyStudy;
