import { useEffect, useMemo, useState } from "react";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function useCountdown(target: number | null | undefined) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = useMemo(() => {
    if (!target) return 0;
    const r = target - now;
    return r > 0 ? r : 0;
  }, [target, now]);

  const expired = remaining <= 0;

  const formatted = useMemo(() => {
    let s = Math.floor(remaining / 1000);
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    s -= m * 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }, [remaining]);

  return { remainingMs: remaining, expired, formatted };
}

