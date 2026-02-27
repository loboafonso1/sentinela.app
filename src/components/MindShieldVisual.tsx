import { motion, useReducedMotion } from "framer-motion";
import React from "react";

type Props = {
  size?: number;
  className?: string;
  ariaLabel?: string;
};

export default function MindShieldVisual({ size = 220, className, ariaLabel = "Blindagem da mente" }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className={className} style={{ width: "100%" }} aria-label={ariaLabel}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="mx-auto max-w-full h-auto select-none"
        role="img"
      >
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="g2" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="98" fill="url(#g2)"/>

        <path
          d="M100 24 C70 24 48 40 48 70 v28 c0 40 32 62 52 70 c20-8 52-30 52-70 V70 C152 40 130 24 100 24z"
          fill="none"
          stroke="url(#g1)"
          strokeWidth="6"
        />

        <path
          d="M86 78c-10 4-16 12-16 22c0 14 12 26 28 26s28-12 28-26c0-10-6-18-16-22c-2-8-10-14-20-14s-18 6-20 14"
          fill="none"
          stroke="hsl(var(--foreground))"
          opacity="0.75"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <g>
          <circle cx="100" cy="100" r="70" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="6 8" />
          <circle cx="100" cy="100" r="58" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 10" />
        </g>
      </svg>

      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 24 }}
          style={{
            position: "relative",
            marginTop: -size,
            width: size,
            height: size,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <svg viewBox="0 0 200 200" width={size} height={size} className="max-w-full h-auto">
            <defs>
              <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="85" fill="none" stroke="url(#g3)" strokeWidth="2" strokeDasharray="2 18" />
            <circle cx="100" cy="100" r="76" fill="none" stroke="url(#g3)" strokeWidth="2" strokeDasharray="1 14" />
            <circle cx="100" cy="100" r="67" fill="none" stroke="url(#g3)" strokeWidth="2" strokeDasharray="3 22" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}
