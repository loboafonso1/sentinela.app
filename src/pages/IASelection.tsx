import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, Search, Shield, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const INTRO_VIDEO_CANDIDATES = ["/video/ia_avatar.mp4"];

type LevelId = "iniciante" | "observador" | "analista" | "investigador";

type Level = {
  id: LevelId;
  label: string;
  subtitle: string;
  color: string;
  icon: typeof Shield;
  audio: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

const levels: Level[] = [
  { id: "iniciante", label: "Iniciante", subtitle: "Entrada controlada", color: "#00E5FF", icon: Shield, audio: "/audio/ia_resposta_iniciante.mp3" },
  { id: "observador", label: "Observador", subtitle: "Leitura silenciosa", color: "#00FF9C", icon: Eye, audio: "/audio/ia_resposta_observador.mp3" },
  { id: "analista", label: "Analista", subtitle: "Protocolo tático", color: "#A855F7", icon: Search, audio: "/audio/ia_resposta_analista.mp3" },
  { id: "investigador", label: "Investigador", subtitle: "Rastreamento ativo", color: "#FFC857", icon: Zap, audio: "/audio/ia_resposta_investigador.mp3" },
];

const IASelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoCandidatesRef = useRef<string[]>(INTRO_VIDEO_CANDIDATES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [phase, setPhase] = useState<"intro_playing" | "choices" | "selection_playing">("intro_playing");
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [introOverlayVisible, setIntroOverlayVisible] = useState(true);
  const [videoSrc, setVideoSrc] = useState<string>(INTRO_VIDEO_CANDIDATES[0] ?? "/video/ia_avatar.mp4");
  const [focusedId, setFocusedId] = useState<LevelId | null>(null);
  const [pressedId, setPressedId] = useState<LevelId | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const pointerActiveRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [idleLoop, setIdleLoop] = useState(false);
  const idleLoopStartRef = useRef<number>(0);
  const idleLoopEndRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    const videoEl = videoRef.current;
    const playVideo = async () => {
      const v = videoEl;
      if (!v) return;
      try {
        v.muted = false;
        await v.play();
        if (!cancelled) {
          setVideoMuted(false);
          setAudioBlocked(false);
        }
      } catch {
        try {
          v.muted = true;
          await v.play();
        } catch {
          void 0;
        }
        if (!cancelled) {
          setVideoMuted(true);
          setAudioBlocked(true);
        }
      }
    };

    playVideo();
    const t = window.setTimeout(() => {
      if (!cancelled) setIntroOverlayVisible(false);
    }, 1600);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (videoEl) {
        videoEl.pause();
      }
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!idleLoop) return;

    const onTimeUpdate = () => {
      const start = idleLoopStartRef.current;
      const end = idleLoopEndRef.current;
      if (!end || end <= start) return;
      if (v.currentTime >= end - 0.02) {
        v.currentTime = start;
      }
    };

    v.addEventListener("timeupdate", onTimeUpdate);
    return () => v.removeEventListener("timeupdate", onTimeUpdate);
  }, [idleLoop]);

  useEffect(() => {
    if (phase !== "choices") return;
    const onPointerUp = () => {
      pointerActiveRef.current = false;
      setPressedId(null);
    };
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [phase]);

  const pointerMoveResolve = () => {
    if (!pointerActiveRef.current) return;
    const p = lastPointRef.current;
    if (!p) return;
    const el = document.elementFromPoint(p.x, p.y);
    const btn = el?.closest?.("[data-level-id]") as HTMLElement | null;
    const id = (btn?.dataset.levelId as LevelId | undefined) || null;
    if (id) setFocusedId(id);
  };

  const handleVideoError = () => {
    const remaining = videoCandidatesRef.current.slice(1);
    videoCandidatesRef.current = remaining;
    const next = remaining[0];
    if (next) setVideoSrc(next);
    else {
      setPhase("choices");
    }
  };

  const ensureIdleLoopPlaying = async () => {
    const v = videoRef.current;
    if (!v) return;

    setVideoMuted(true);
    setAudioBlocked(false);
    setIdleLoop(true);

    const end = idleLoopEndRef.current || v.duration || 0;
    const start = idleLoopStartRef.current;
    if (end && end > start && v.currentTime < start) {
      v.currentTime = start;
    }

    try {
      v.muted = true;
      await v.play();
    } catch {
      void 0;
    }
  };

  const handleSelect = (level: Level) => {
    if (selectedId) return;
    setSelectedId(level.id);
    setPhase("selection_playing");
    setPressedId(null);
    try {
      localStorage.setItem("user_level_name", level.label);
      if (user?.id) localStorage.setItem(`sentinela:user_level_name:${user.id}`, level.label);
    } catch {
      void 0;
    }

    void ensureIdleLoopPlaying();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setTimeout(() => {
      const responseAudio = new Audio(level.audio);
      audioRef.current = responseAudio;
      responseAudio.onended = () => {
        setIsFadingOut(true);
        setTimeout(() => navigate("/treinamento"), 800);
      };
      responseAudio.play().catch(() => {
        setIsFadingOut(true);
        setTimeout(() => navigate("/treinamento"), 800);
      });
    }, 500);
  };

  return (
    <div className={`fixed inset-0 bg-[#0A0014] text-white overflow-hidden transition-opacity duration-700 ${isFadingOut ? "opacity-0" : "opacity-100"}`}>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#4C00B0_0%,_transparent_55%)] opacity-25 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={phase === "choices" ? { opacity: 1, y: [0, -6, 0] } : { opacity: 1, y: 0 }}
        transition={phase === "choices" ? { duration: 0.45, ease: "easeOut" } : { duration: 0.35, ease: "easeOut" }}
        className="relative z-10 mx-auto h-[100dvh] max-w-md px-6 pt-[max(env(safe-area-inset-top,12px),12px)] pb-[max(env(safe-area-inset-bottom,12px),12px)] flex flex-col"
      >
        <div className="flex-1 flex flex-col items-center justify-start">
          <div className="w-full mt-2">
            <div className="relative w-full h-[58dvh] max-h-[560px] rounded-[999px] overflow-hidden border border-[#7A00FF]/25 bg-black shadow-[0_0_30px_rgba(122,0,255,0.25)]">
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted={videoMuted}
                loop={false}
                playsInline
                className="w-full h-full object-cover scale-110 opacity-95"
                onError={handleVideoError}
                onLoadedMetadata={() => {
                  const v = videoRef.current;
                  if (!v || !Number.isFinite(v.duration)) return;
                  const end = Math.max(0, v.duration);
                  const start = Math.max(0, end - 1.2);
                  idleLoopStartRef.current = start;
                  idleLoopEndRef.current = end;
                }}
                onEnded={() => {
                  setPhase("choices");
                  setVideoMuted(true);
                  setAudioBlocked(false);
                  setIdleLoop(true);
                  const v = videoRef.current;
                  if (v) {
                    const end = idleLoopEndRef.current || v.duration || 0;
                    const start = idleLoopStartRef.current;
                    if (end && end > start) {
                      v.currentTime = start;
                    } else {
                      v.currentTime = 0;
                    }
                    v.play().catch(() => void 0);
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(0,242,255,0.18)_0%,_transparent_55%)]" />

              <AnimatePresence>
                {introOverlayVisible && phase !== "choices" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl px-4 py-2"
                  >
                    <div className="text-[10px] uppercase tracking-[0.35em] text-white/70 font-bold">Sincronização iniciada</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {audioBlocked && phase !== "choices" && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={async () => {
                      try {
                        const v = videoRef.current;
                        if (!v) return;
                        v.muted = false;
                        setVideoMuted(false);
                        await v.play();
                        setAudioBlocked(false);
                      } catch {
                        void 0;
                      }
                    }}
                    className="absolute bottom-4 left-4 right-4 py-4 rounded-3xl bg-gradient-to-r from-[#7A00FF] to-[#FF00D9] text-white font-bold tracking-[0.35em] uppercase text-[10px] active:scale-[0.98] transition-all"
                  >
                    Ativar som
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full mt-4">
          <div className="h-[36dvh] max-h-[320px] min-h-[260px]">
            <AnimatePresence>
              {phase === "choices" && (
                <motion.div
                  ref={listRef}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, x: 60 },
                    show: {
                      opacity: 1,
                      x: 0,
                      transition: { type: "spring", damping: 18, stiffness: 140, staggerChildren: 0.08, delayChildren: 0.03 },
                    },
                  }}
                  onPointerDown={(e) => {
                    pointerActiveRef.current = true;
                    lastPointRef.current = { x: e.clientX, y: e.clientY };
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    rafRef.current = requestAnimationFrame(() => {
                      rafRef.current = null;
                      pointerMoveResolve();
                    });
                  }}
                  onPointerMove={(e) => {
                    if (!pointerActiveRef.current) return;
                    lastPointRef.current = { x: e.clientX, y: e.clientY };
                    if (rafRef.current) return;
                    rafRef.current = requestAnimationFrame(() => {
                      rafRef.current = null;
                      pointerMoveResolve();
                    });
                  }}
                  onPointerLeave={() => {
                    if (!pointerActiveRef.current) setFocusedId(null);
                  }}
                  className="space-y-3 select-none"
                >
                  {levels.map((level) => {
                    const Icon = level.icon;
                    const id = level.id;
                    const selected = selectedId === id;
                    const isFocused = focusedId === id;
                    const isPressed = pressedId === id;
                    const disabled = !!selectedId && !selected;
                    const glow = selected ? 0.45 : isPressed ? 0.36 : isFocused ? 0.3 : 0.18;
                    const borderAlpha = selected ? 0.55 : isFocused ? 0.42 : 0.3;
                    const iconGlow = selected ? 0.75 : isFocused ? 0.6 : 0.35;
                    const scale = disabled ? 1 : isPressed ? 0.98 : isFocused ? 1.03 : 1;

                    return (
                      <motion.button
                        key={id}
                        type="button"
                        data-level-id={id}
                        variants={{
                          hidden: { opacity: 0, y: 12, filter: "blur(10px)" },
                          show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.28, ease: "easeOut" } },
                        }}
                        animate={{ scale }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        onPointerEnter={() => setFocusedId(id)}
                        onPointerDown={() => setPressedId(id)}
                        onPointerUp={() => setPressedId(null)}
                        onClick={() => handleSelect(level)}
                        disabled={disabled}
                        className="w-full rounded-[26px] text-left backdrop-blur-[12px] border active:outline-none"
                        style={{
                          background: "rgba(20, 20, 30, 0.40)",
                          borderColor: hexToRgba(level.color, borderAlpha),
                          boxShadow: [
                            `0 0 0 1px ${hexToRgba(level.color, borderAlpha)}`,
                            `0 10px 40px ${hexToRgba(level.color, glow * 0.35)}`,
                            `0 0 22px ${hexToRgba(level.color, glow * 0.55)}`,
                            `inset 0 1px 0 rgba(255,255,255,0.06)`,
                            `inset 0 -8px 18px rgba(0,0,0,0.35)`,
                          ].join(", "),
                          transformOrigin: "center",
                        }}
                      >
                        <div className="px-6 py-4 flex items-center gap-5">
                          <div
                            className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border"
                            style={{
                              borderColor: hexToRgba(level.color, 0.35),
                              background: "rgba(0,0,0,0.22)",
                              boxShadow: `0 0 18px ${hexToRgba(level.color, iconGlow)}`,
                            }}
                          >
                            <Icon className="w-6 h-6" style={{ color: level.color, filter: `drop-shadow(0 0 10px ${hexToRgba(level.color, 0.6)})` }} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-[15px] font-semibold tracking-wide text-white">{level.label}</div>
                            <div className="text-[11px] tracking-[0.18em] uppercase text-white/55 mt-1 truncate">{level.subtitle}</div>
                          </div>

                          <motion.div
                            className="shrink-0 w-[10px] h-12 rounded-full"
                            animate={{
                              opacity: selected ? 1 : isFocused ? 0.85 : 0.55,
                              boxShadow: selected
                                ? `0 0 22px ${hexToRgba(level.color, 0.85)}`
                                : isFocused
                                  ? `0 0 16px ${hexToRgba(level.color, 0.65)}`
                                  : `0 0 10px ${hexToRgba(level.color, 0.45)}`,
                            }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            style={{ background: hexToRgba(level.color, selected ? 0.9 : 0.7) }}
                          >
                            <motion.div
                              className="w-full h-full rounded-full"
                              animate={{ opacity: [0.55, 1, 0.55] }}
                              transition={{ duration: selected ? 1.1 : 1.6, repeat: Infinity, ease: "easeInOut" }}
                              style={{ background: "rgba(255,255,255,0.06)" }}
                            />
                          </motion.div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {selectedId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-center text-[10px] uppercase tracking-[0.35em] text-white/35">
            Sincronizando com a IA…
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default IASelection;
