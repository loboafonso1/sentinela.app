import { motion } from "framer-motion";

export type WeeklyDatum = { day: string; value: number; minutes?: number };

type Props = {
  data?: WeeklyDatum[];
  minHeight?: number;
};

export default function WeeklyBars({ data, minHeight = 96 }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Sem dados de atividade nesta semana</p>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between gap-2" style={{ height: minHeight }}>
      {data.map((d, i) => {
        const pct = Math.max(0, Math.min(100, Math.round(d.value || 0)));
        const aria = `${pct}% concluído${d.minutes ? `, ${d.minutes} min` : ""}`;
        return (
          <div key={`${d.day}-${i}`} className="flex flex-col items-center flex-1 gap-1.5">
            <div className="w-full flex-1 flex items-end">
              <motion.div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                aria-label={`Atividade de ${d.day}`}
                title={aria}
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
                className={`w-full rounded-lg ${pct > 0 ? "bg-primary" : "bg-secondary"} shadow-gold`}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}
