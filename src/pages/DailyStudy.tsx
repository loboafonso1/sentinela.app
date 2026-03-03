import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, PlayCircle, Flame, Zap, Shield, FileText, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMockData } from "@/hooks/useMockData";
import { dailyVideos } from "@/data/media";
import { getDayModule } from "@/modules";
import VideoModal from "@/components/VideoModal";
import DailyQuiz, { QuizQuestion } from "@/components/DailyQuiz";
import { useCountdown } from "@/hooks/useCountdown";
import { computeMetrics, computeMindProfile, finalizeDayProgress, loadProgress } from "@/lib/progress";

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
  const { signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  const [tab, setTab] = useState<"video" | "aulas" | "progresso">("video");
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoOpenDay, setVideoOpenDay] = useState<number | null>(null);
  const [adminUnlockOn, setAdminUnlockOn] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem("sent_unlock_max");
      return !!v && Number(v) >= 1;
    } catch {
      return false;
    }
  });
  const [videoCompleted, setVideoCompleted] = useState<boolean>(() => {
    const d = Number(localStorage.getItem("sentinela_last_active_day") || "1") || 1;
    return localStorage.getItem(`sent_video_day${d}_done`) === "true";
  });
  const [quizCompleted, setQuizCompleted] = useState<boolean>(() => {
    const d = Number(localStorage.getItem("sentinela_last_active_day") || "1") || 1;
    return localStorage.getItem(`sent_quiz_day${d}_done`) === "true";
  });
  const [nextUnlockAt, setNextUnlockAt] = useState<number | null>(() => {
    const v = localStorage.getItem("sentinela_next_unlock_at");
    return v ? Number(v) : null;
  });
  const [finalizing, setFinalizing] = useState(false);

  // Session guard handled by ProtectedRoute in App.tsx

  const { formatted: countdownFmt, expired: countdownExpired } = useCountdown(nextUnlockAt);
  const lastCompletedDay = Number(localStorage.getItem("sentinela_last_completed_day") ?? "0") || 0;
  const DEV_UNLOCK_MAX = (() => {
    try {
      const local = localStorage.getItem("sent_unlock_max");
      if (local) return Number(local);
    } catch {}
    const env = import.meta.env.VITE_DEV_UNLOCK_MAX;
    if (env) return Number(env);
    if (import.meta.env.DEV) return 7;
    return NaN;
  })();
  const devUnlockActive = Number.isFinite(DEV_UNLOCK_MAX) && DEV_UNLOCK_MAX >= 1;
  const effectiveUnlockedDay = devUnlockActive
    ? Math.min(DEV_UNLOCK_MAX, 7)
    : lastCompletedDay >= 1
      ? (countdownExpired ? Math.max(unlockedDay, lastCompletedDay + 1) : Math.max(unlockedDay, lastCompletedDay))
      : unlockedDay;
  const [selectedDay, setSelectedDay] = useState<number>(effectiveUnlockedDay);
  useEffect(() => { setSelectedDay(effectiveUnlockedDay); }, [effectiveUnlockedDay]);
  const currentVideo = dailyVideos[selectedDay - 1] ?? dailyVideos[0];
  const currentModule = getDayModule(selectedDay);
  const displayTitle = `Dia ${selectedDay} — ${lessons[selectedDay - 1]?.title ?? currentVideo.title ?? "Aula"}`;
  const extractYouTubeId = (url: string): string | null => {
    const r1 = /(?:youtube\.com\/.*(?:\?|&)v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const r2 = /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/;
    const m1 = url.match(r1);
    if (m1) return m1[1];
    const m2 = url.match(r2);
    return m2 ? m2[1] : null;
  };
  const lastOpenRef = useRef<number | null>(null);
  const [isShort, setIsShort] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbSrc, setThumbSrc] = useState<string | null>(null);
  const thumbIdxRef = useRef<number>(0);
  const thumbCandidatesRef = useRef<string[]>([]);
  const makeThumbCandidates = (id: number): string[] => {
    const c1 = `/thumbs/daily/${id}.jpg`;
    const c2 = `/thumbs/daily/day-${id}.jpg`;
    const c3 = encodeURI(`/thumbs/daily/dia ${id}.jpg`);
    const c4 = `/thumbs/daily/dia-${id}.jpg`;
    return [c1, c2, c3, c4];
  };
  const getEffectiveVideoUrl = (day: number): string => {
    try {
      const override = localStorage.getItem(`sent_preview_video_override_day${day}`);
      if (override && override.trim().length > 0) return override;
    } catch {}
    return getDayModule(day)?.video_url ?? dailyVideos[day - 1]?.url ?? "";
  };
  const openVideo = (day: number, url: string) => {
    const id = extractYouTubeId(url) ?? "dQw4w9WgXcQ";
    setIsShort(/youtube\.com\/shorts\//.test(url));
    setVideoUrl(url);
    setVideoId(id);
    setVideoOpenDay(day);
    setIsVideoOpen(true);
    lastOpenRef.current = Date.now();
  };
  const progressStore = loadProgress();
  useEffect(() => {
    const id = selectedDay || 1;
    const candidates = makeThumbCandidates(id);
    thumbCandidatesRef.current = candidates;
    thumbIdxRef.current = 0;
    setThumbSrc(candidates[0]);
  }, [selectedDay]);
  const handleThumbError = () => {
    const nextIdx = thumbIdxRef.current + 1;
    const arr = thumbCandidatesRef.current;
    if (nextIdx < arr.length) {
      thumbIdxRef.current = nextIdx;
      setThumbSrc(arr[nextIdx]);
    } else {
      setThumbSrc(null);
    }
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
  // anel de progresso removido do cabeçalho

  const getNextLocalMidnight = () => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0, 0, 0).getTime();
  };

  /* simulação reset removida */

  const handleVideoClose = () => {
    setIsVideoOpen(false);
    setVideoCompleted(true);
    setQuizCompleted(false);
    const dayForClose = videoOpenDay ?? effectiveUnlockedDay;
    try { localStorage.setItem("sentinela_last_active_day", String(dayForClose)); } catch {}
    try { localStorage.setItem(`sent_video_day${dayForClose}_done`, "true"); } catch {}
    try { localStorage.setItem(`sent_quiz_day${dayForClose}_done`, "false"); } catch {}
    setTab("aulas");
    setVideoOpenDay(null);
  };
  useEffect(() => {
    if (!isVideoOpen && lastOpenRef.current && !videoCompleted) {
      setVideoCompleted(true);
      setQuizCompleted(false);
      try { localStorage.setItem("sentinela_last_active_day", String(effectiveUnlockedDay)); } catch {}
      try { localStorage.setItem(`sent_video_day${effectiveUnlockedDay}_done`, "true"); } catch {}
      try { localStorage.setItem(`sent_quiz_day${effectiveUnlockedDay}_done`, "false"); } catch {}
      setTab("aulas");
      lastOpenRef.current = null;
    }
  }, [isVideoOpen, videoCompleted]);

  /* gatilho de reset via URL removido */

  const onQuizComplete = () => {
    setQuizCompleted(true);
    try { localStorage.setItem(`sent_quiz_day${effectiveUnlockedDay}_done`, "true"); } catch {}
    finalizeDayProgress(effectiveUnlockedDay);
  };

  const finalizeDay = () => {
    setFinalizing(true);
    const target = getNextLocalMidnight();
    try { localStorage.setItem("sentinela_next_unlock_at", String(target)); } catch {}
    try { localStorage.setItem("sentinela_last_completed_day", String(effectiveUnlockedDay)); } catch {}
    setNextUnlockAt(target);
    setTimeout(() => setFinalizing(false), 700);
  };

  const day1Questions: QuizQuestion[] = [
    {
      question: "Como o erro costuma começar na vida da igreja?",
      options: ["Com pequenas distorções toleradas", "Negando abertamente o evangelho", "Apenas com heresias explícitas", "Com debates acadêmicos complexos"],
      correctIndex: 0,
      verseRef: "Gl 5:9",
      verseText: "Um pouco de fermento leveda toda a massa.",
    },
    {
      question: "Qual prática protege contra o início silencioso do erro?",
      options: ["Seguir a maioria", "Examinar diariamente as Escrituras", "Confiar na intuição", "Apoiar-se no carisma do pregador"],
      correctIndex: 1,
      verseRef: "At 17:11",
      verseText: "Examinavam diariamente as Escrituras para ver se as coisas eram assim.",
    },
    {
      question: "Ao ouvir um novo ensino, qual atitude é correta?",
      options: ["Receber sem julgar", "Testar e reter o que é bom", "Rejeitar tudo que é novo", "Crer por causa da autoridade de quem ensina"],
      correctIndex: 1,
      verseRef: "1Ts 5:21",
      verseText: "Examinai tudo. Retende o que é bom.",
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
              {/* Tabs + badge e botão de sair no mesmo alinhamento */}
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
                {import.meta.env.DEV && (
                  <button
                    onClick={() => {
                      const next = !adminUnlockOn;
                      try {
                        if (next) localStorage.setItem("sent_unlock_max", "7");
                        else localStorage.removeItem("sent_unlock_max");
                      } catch {}
                      setAdminUnlockOn(next);
                    }}
                    className={`px-3 py-2 rounded-xl text-[11px] font-semibold border ${
                      adminUnlockOn ? "border-emerald-400/40 text-emerald-400 bg-emerald-500/10" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    title="Desbloquear dias 1–7"
                  >
                    {adminUnlockOn ? "Desbloqueio 1–7: ON" : "Desbloqueio 1–7: OFF"}
                  </button>
                )}
                {/* Botão de sair alinhado às tabs, após Progresso */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  title="Sair"
                  aria-label="Sair"
                  className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 h-9 px-3 ml-1"
                >
                  Sair
                </Button>
                {/* Empurra o badge para a direita em telas maiores */}
                <div className="hidden md:flex items-center ml-auto">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                    🟣 Liberado hoje
                  </span>
                </div>
              </div>
              {/* Badge visível em telas pequenas logo abaixo das tabs */}
              <div className="mt-3 md:hidden">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-foreground">🟣 Liberado hoje</span>
              </div>
            </div>
            {/* coluna direita removida (widget de progresso) */}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-responsive section-gap">
        {/* Header grid move: tabs e badge já estão no header; vídeo começa abaixo */}

        {tab === "video" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative">
            <button
              onClick={() => openVideo(selectedDay, getEffectiveVideoUrl(selectedDay))}
              className="group w-full text-left rounded-3xl border border-border bg-card p-card shadow-premium"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-[9/16] relative">
                  {thumbSrc ? (
                    <>
                      <img
                        src={thumbSrc}
                        onError={handleThumbError}
                        alt={displayTitle}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-105">
                          <PlayCircle className="h-8 w-8 text-white drop-shadow" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white/90 drop-shadow transition-transform duration-200 ease-out group-hover:scale-105" />
                    </div>
                  )}
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
            
            </div>
            <div className="rounded-3xl border border-border bg-card p-card space-y-2">
              {DAYS.map((d) => {
                const unlocked = d <= effectiveUnlockedDay;
                const t = lessons[d - 1]?.title ?? "Aula";
                const rec = progressStore.days.find((x) => x.day === d);
                const isCompleted = devUnlockActive ? true : !!rec?.completedAt;
                return (
                  <div
                    key={d}
                    className={`rounded-2xl border p-4 flex items-center justify-between transition-all ${
                      unlocked ? "bg-card hover:border-primary/40" : "bg-muted/30 border-border opacity-70"
                    }`}
                    onClick={() => { if (unlocked) setSelectedDay(d); }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">Dia {d} de {TOTAL_DAYS} — {t}</p>
                      <p className="text-xs text-muted-foreground">Duração ~ 15 min</p>
                    </div>
                    {unlocked ? (
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] px-2 py-1">
                            Concluído
                          </span>
                        )}
                        <button
                          onClick={() => openVideo(d, getEffectiveVideoUrl(d))}
                          className={`rounded-lg ${d === effectiveUnlockedDay ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border border-border text-foreground"} text-xs font-medium py-2 px-3 hover:opacity-95`}
                          title={d === effectiveUnlockedDay ? "Assistir agora" : "Assistir novamente"}
                        >
                          {d === effectiveUnlockedDay ? "Assistir agora" : "Assistir novamente"}
                        </button>
                      </div>
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
            
          </div>
          <div className="mb-4">
            {!(devUnlockActive || videoCompleted) && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                Assista a aula de hoje para desbloquear o quiz.
              </div>
            )}
            {(devUnlockActive || videoCompleted) && !quizCompleted && (
              <DailyQuiz
                questions={currentModule?.quiz ?? day1Questions}
                onComplete={onQuizComplete}
                dayNumber={effectiveUnlockedDay}
              />
            )}
            {(devUnlockActive || videoCompleted) && quizCompleted && (
              <div className="space-y-3">
                <button
                  onClick={finalizeDay}
                  disabled={finalizing || (!devUnlockActive && !!nextUnlockAt && !countdownExpired)}
                  className={`w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold py-3 px-4 shadow-lg transition ${finalizing ? "opacity-80" : "hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]"}`}
                >
                  {finalizing ? "Concluindo..." : "Concluir treino de hoje"}
                  <span className="ml-2 text-white/80 text-xs">Desbloquear o próximo dia</span>
                </button>
                {!devUnlockActive && nextUnlockAt && !countdownExpired && (
                  <div className="rounded-2xl border border-border bg-card p-3 text-center text-xs text-muted-foreground">
                    Próxima aula disponível em: <span className="font-semibold text-foreground">{countdownFmt}</span>
                  </div>
                )}
                {!devUnlockActive && nextUnlockAt && countdownExpired && (
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
              const rec = progressStore.days.find((x) => x.day === d);
              const isCompleted = devUnlockActive ? true : !!rec?.completedAt;
              return (
                <div
                  key={d}
                  className={`rounded-2xl border p-4 flex items-center justify-between transition-all ${
                    unlocked ? "bg-card hover:border-primary/40" : "bg-muted/30 border-border opacity-70"
                  }`}
                  onClick={() => { if (unlocked) setSelectedDay(d); }}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">Dia {d} de {TOTAL_DAYS} — {t}</p>
                    <p className="text-xs text-muted-foreground">Duração ~ 15 min</p>
                  </div>
                  {unlocked ? (
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] px-2 py-1">
                          Concluído
                        </span>
                      )}
                      <button
                        onClick={() => openVideo(d, getEffectiveVideoUrl(d))}
                        className={`rounded-lg ${d === effectiveUnlockedDay ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border border-border text-foreground"} text-xs font-medium py-2 px-3 hover:opacity-95`}
                        title={d === effectiveUnlockedDay ? "Assistir agora" : "Assistir novamente"}
                      >
                        {d === effectiveUnlockedDay ? "Assistir agora" : "Assistir novamente"}
                      </button>
                    </div>
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

          <DashboardProgresso
            totalDays={TOTAL_DAYS}
            lessons={lessons}
            effectiveUnlockedDay={effectiveUnlockedDay}
            countdownExpired={countdownExpired}
            countdownFmt={countdownFmt}
            nextUnlockAt={nextUnlockAt}
          />
        </motion.div>
        )}
      </main>
      <VideoModal open={isVideoOpen} videoId={videoId ?? "dQw4w9WgXcQ"} isShort={isShort} sourceUrl={videoUrl ?? currentVideo.url} onClose={handleVideoClose} />
    </div>
  );
};

export default DailyStudy;

type DashboardProps = {
  totalDays: number;
  lessons: { day: number; title: string }[];
  effectiveUnlockedDay: number;
  nextUnlockAt: number | null;
  countdownExpired: boolean;
  countdownFmt: string;
};

const DashboardProgresso = ({ totalDays, lessons, effectiveUnlockedDay, nextUnlockAt, countdownExpired, countdownFmt }: DashboardProps) => {
  const store = loadProgress();
  const m = computeMetrics();
  const profile = computeMindProfile({ firstTryRate: m.firstTryRate, avgAttempts: m.avgAttempts, completedDays: m.completedDays });
  const percent = m.percent;
  const r = 64;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(c, (percent / 100) * c));
  const avatar = localStorage.getItem("sentinela_avatar") || undefined;
  const nameRaw = (() => {
    try {
      const raw = localStorage.getItem("supabase.auth.token");
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data?.currentSession?.user?.user_metadata?.full_name || data?.user?.user_metadata?.full_name || null;
    } catch {
      return null;
    }
  })();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-premium">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
            {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full" />}
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground">Relatório de Discernimento</p>
            <p className="text-sm font-semibold text-foreground">{nameRaw || "Sentinela"}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-foreground">{m.xpTotal.toLocaleString()} XP</p>
            <p className="text-[11px] text-emerald-400">{m.todayXP > 0 ? `+${m.todayXP} XP hoje` : ""}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-col md:flex-row md:items-center md:gap-8">
          <div className="mx-auto w-[180px] h-[180px] relative">
            <svg className="w-full h-full" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={r} fill="none" stroke="hsl(var(--muted-foreground))" strokeOpacity="0.15" strokeWidth="14" />
              <circle
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke="url(#grad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${c - dash}`}
                transform="rotate(-90 80 80)"
              />
              <defs>
                <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-foreground">{percent}%</div>
                <div className="text-[11px] text-muted-foreground">Jornada concluída</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 mt-4 md:mt-0">
            <div className="rounded-2xl border border-border bg-background/60 backdrop-blur p-4">
              <div className="text-[11px] text-muted-foreground mb-1">Dias</div>
              <div className="text-xl font-extrabold text-foreground">{m.completedDays}/{totalDays}</div>
            </div>
            <div className="rounded-2xl border border-border bg-background/60 backdrop-blur p-4">
              <div className="text-[11px] text-muted-foreground mb-1">Acerto 1ª tentativa</div>
              <div className="text-xl font-extrabold text-foreground">{Math.round(m.firstTryRate * 100)}%</div>
            </div>
            <div className="rounded-2xl border border-border bg-background/60 backdrop-blur p-4">
              <div className="text-[11px] text-muted-foreground mb-1">Tentativas médias</div>
              <div className="text-xl font-extrabold text-foreground">{m.avgAttempts.toFixed(1)}</div>
            </div>
            <div className="rounded-2xl border border-border bg-background/60 backdrop-blur p-4">
              <div className="text-[11px] text-muted-foreground mb-1">Sequência</div>
              <div className="text-xl font-extrabold text-foreground">{m.streak} dias</div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-5 shadow-premium">
        <div className="mb-2 text-sm font-semibold text-foreground">Tipo de Mente: {profile.title}</div>
        <div className="mb-2 text-xs text-muted-foreground">Risco de influência: {profile.riskLevel}</div>
        <div className="text-sm text-foreground mb-3">{profile.summary}</div>
        <ul className="list-disc pl-5 text-xs text-muted-foreground">
          {profile.recommendations.map((r, i) => (<li key={i}>{r}</li>))}
        </ul>
      </div>
      <div className="rounded-3xl border border-border bg-card p-5 shadow-premium">
        <div className="flex items-center gap-2 mb-3">
          <LineChart className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Jornada — 30 Dias</h3>
          {m.todayXP > 0 && <span className="ml-auto rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] px-2 py-1">+XP hoje</span>}
          <span className="rounded-full border border-border text-[11px] px-2 py-1 text-muted-foreground">Meta: 3/3 de primeira</span>
        </div>
        <div className="space-y-2">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
            const rec = store.days.find((x) => x.day === d);
            const isCompleted = !!rec?.completedAt;
            const unlocked = d <= effectiveUnlockedDay || isCompleted;
            const t = lessons[d - 1]?.title ?? "Aula";
            return (
              <div key={d} className={`rounded-2xl border p-4 flex items-center justify-between ${unlocked ? "bg-card" : "bg-muted/30 border-border opacity-80"}`}>
                <div>
                  <p className="text-sm font-semibold text-foreground">Dia {d} de {totalDays} — {t}</p>
                  <p className="text-[11px] text-muted-foreground">Duração ~ 15 min</p>
                </div>
                {isCompleted ? (
                  <span className="text-xs text-emerald-400">✅ Concluído</span>
                ) : d === effectiveUnlockedDay ? (
                  <span className="text-xs text-primary">🟣 Liberado hoje</span>
                ) : (
                  <>
                    {d === effectiveUnlockedDay + 1 && nextUnlockAt && !countdownExpired ? (
                      <span className="text-xs text-muted-foreground">🔒 Bloqueado — libera em {countdownFmt}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">🔒 Bloqueado — libera amanhã</span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
