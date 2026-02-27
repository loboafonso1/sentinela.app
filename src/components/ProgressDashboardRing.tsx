import { useEffect, useId, useMemo, useState } from "react";

type Props = {
  percent: number;
  levelLabel: string;
  avatarUrl?: string;
  size?: "sm" | "md";
};

const ProgressDashboardRing = ({ percent, levelLabel, avatarUrl, size = "md" }: Props) => {
  const [display, setDisplay] = useState(0);
  const id = useId();

  const sizePx = size === "sm" ? 96 : 140;
  const stroke = size === "sm" ? 10 : 12;
  const viewBox = `0 0 ${sizePx} ${sizePx / 2}`;
  const r = sizePx / 2 - stroke;
  const cx = sizePx / 2;
  const cy = sizePx / 2;
  const arc = useMemo(() => `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`, [cx, cy, r]);

  useEffect(() => {
    const target = Math.max(0, Math.min(100, Math.round(percent)));
    let raf = 0;
    const start = performance.now();
    const duration = 800;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / duration);
      setDisplay(Math.round(t * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [percent]);

  return (
    <div
      className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl p-3"
      style={{ width: sizePx }}
    >
      <div className="relative" style={{ width: sizePx, height: sizePx / 2 }}>
        <svg width={sizePx} height={sizePx / 2} viewBox={viewBox}>
          <defs>
            <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(168,85,247)" />
              <stop offset="100%" stopColor="rgb(236,72,153)" />
            </linearGradient>
          </defs>
          <path
            d={arc}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            pathLength={100}
          />
          <path
            d={arc}
            stroke={`url(#grad-${id})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 - display}
          />
        </svg>
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-2 rounded-full overflow-hidden bg-background"
          style={{ width: size === "sm" ? 40 : 56, height: size === "sm" ? 40 : 56 }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-white/70">👤</div>
          )}
        </div>
      </div>
      <div className="mt-1 text-center">
        <div className="text-white font-extrabold" style={{ fontSize: size === "sm" ? 18 : 22 }}>
          {display}%
        </div>
        <div className="mt-1 inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/90">
          {levelLabel}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboardRing;
