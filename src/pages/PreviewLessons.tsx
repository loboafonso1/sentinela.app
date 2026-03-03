import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, PlayCircle } from "lucide-react";
import { getDayModule } from "@/modules";
import { dailyVideos } from "@/data/media";
import DailyQuiz from "@/components/DailyQuiz";
import VideoModal from "@/components/VideoModal";

const TOTAL_DAYS = 30;
const DAYS = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);

const PreviewLessons = () => {
  const [day, setDay] = useState<number>(1);
  const mod = useMemo(() => getDayModule(day), [day]);
  const videos = useMemo(() => {
    const base: string[] = [];
    const override = (() => {
      try {
        return localStorage.getItem(`sent_preview_video_override_day${day}`) || "";
      } catch { return ""; }
    })();
    if (override) base.push(override);
    if (mod?.video_url) base.push(mod.video_url);
    if (Array.isArray(mod?.extra_videos)) base.push(...mod!.extra_videos.filter(Boolean));
    if (base.length === 0 && dailyVideos[day - 1]?.url) base.push(dailyVideos[day - 1].url);
    return base;
  }, [mod, day]);
  const [videoIdx, setVideoIdx] = useState(0);
  const url = videos[videoIdx] ?? "";
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isShort, setIsShort] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const lastOpenRef = useRef<number | null>(null);
  const [thumbSrc, setThumbSrc] = useState<string | null>(null);
  const extractYouTubeId = (u: string): string | null => {
    const r1 = /(?:youtube\.com\/.*(?:\?|&)v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const r2 = /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/;
    const m1 = u.match(r1);
    if (m1) return m1[1];
    const m2 = u.match(r2);
    return m2 ? m2[1] : null;
  };
  const thumbIdxRef = useRef<number>(0);
  const thumbCandidatesRef = useRef<string[]>([]);
  useEffect(() => {
    const c1 = `/thumbs/daily/${day}.jpg`;
    const c2 = `/thumbs/daily/day-${day}.jpg`;
    const c3 = encodeURI(`/thumbs/daily/dia ${day}.jpg`);
    const c4 = `/thumbs/daily/dia-${day}.jpg`;
    thumbCandidatesRef.current = [c1, c2, c3, c4];
    thumbIdxRef.current = 0;
    setThumbSrc(thumbCandidatesRef.current[0]);
  }, [day]);
  const handleThumbError = () => {
    const next = thumbIdxRef.current + 1;
    if (next < thumbCandidatesRef.current.length) {
      thumbIdxRef.current = next;
      setThumbSrc(thumbCandidatesRef.current[next]);
    } else {
      setThumbSrc(null);
    }
  };
  const quiz = useMemo(() => {
    return (
      mod?.quiz ?? [
        {
          question: "Pergunta de exemplo (adicione no módulo do dia).",
          options: ["Opção A", "Opção B", "Opção C", "Opção D"],
          correctIndex: 0,
          verseRef: "Ref",
          verseText: "Texto de referência.",
        },
        {
          question: "Exemplo 2",
          options: ["A", "B", "C", "D"],
          correctIndex: 1,
          verseRef: "Ref",
          verseText: "Texto.",
        },
        {
          question: "Exemplo 3",
          options: ["A", "B", "C", "D"],
          correctIndex: 2,
          verseRef: "Ref",
          verseText: "Texto.",
        },
      ]
    );
  }, [mod]);
  const openVideo = () => {
    const id = extractYouTubeId(url) ?? "dQw4w9WgXcQ";
    setIsShort(/youtube\.com\/shorts\//.test(url));
    setVideoUrl(url);
    setVideoId(id);
    setIsVideoOpen(true);
    lastOpenRef.current = Date.now();
  };
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-responsive pt-6 pb-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-serif font-extrabold tracking-wide text-foreground">Modo de Pré-visualização</h1>
          <p className="text-xs text-muted-foreground">Somente administradores. Não afeta o progresso real.</p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-responsive section-gap">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-3xl border border-border bg-card p-card space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Selecionar Dia</h2>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>Dia {d}</option>
                ))}
              </select>
              {videos.length > 1 && (
                <select
                  value={videoIdx}
                  onChange={(e) => setVideoIdx(Number(e.target.value))}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  title="Selecionar vídeo"
                >
                  {videos.map((_, i) => (
                    <option key={i} value={i}>Vídeo {i + 1}</option>
                  ))}
                </select>
              )}
              <button onClick={openVideo} className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium py-2 px-3 hover:opacity-95">
                Abrir vídeo
              </button>
              <button onClick={() => setShowQuiz(true)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:border-primary/40">
                Iniciar quiz
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-muted/10 p-4 text-xs text-muted-foreground">
              Vídeo atual: {url || "não definido"}
            </div>
            <div className="rounded-2xl border border-border bg-muted/10 p-4 text-xs text-muted-foreground space-y-2">
              <div className="text-foreground font-semibold mb-1">Override local de vídeo (somente preview)</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://youtube.com/..."
                  defaultValue={(() => { try { return localStorage.getItem(`sent_preview_video_override_day${day}`) || ""; } catch { return ""; } })()}
                  onChange={(e) => (e.currentTarget as any).__value = e.target.value}
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2"
                />
                <button
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    const val = input?.value?.trim() || "";
                    try {
                      if (val) localStorage.setItem(`sent_preview_video_override_day${day}`, val);
                      else localStorage.removeItem(`sent_preview_video_override_day${day}`);
                    } catch {}
                    setVideoIdx(0);
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:border-primary/40"
                >
                  Salvar
                </button>
                <button
                  onClick={() => { try { localStorage.removeItem(`sent_preview_video_override_day${day}`); } catch {}; setVideoIdx(0); }}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:border-primary/40"
                >
                  Limpar
                </button>
              </div>
            </div>
            <button onClick={openVideo} className="group rounded-2xl border border-border overflow-hidden text-left">
              <div className="aspect-[9/16] relative">
                {thumbSrc ? (
                  <>
                    <img
                      src={thumbSrc}
                      onError={handleThumbError}
                      alt={`Dia ${day}`}
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
                    <PlayCircle className="h-16 w-16 text-white/90" />
                  </div>
                )}
              </div>
            </button>
            {showQuiz && (
              <DailyQuiz
                questions={quiz}
                onComplete={() => setShowQuiz(false)}
                dayNumber={day}
                recordProgress={false}
              />
            )}
          </div>
        </motion.div>
      </main>
      <VideoModal open={isVideoOpen} videoId={videoId ?? "dQw4w9WgXcQ"} isShort={isShort} sourceUrl={videoUrl ?? url} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
};

export default PreviewLessons;
