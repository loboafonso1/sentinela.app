import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { recordWrongAttempt, recordCorrectAttempt } from "@/lib/progress";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  verseRef: string;
  verseText: string;
};

type Props = {
  questions: QuizQuestion[];
  onComplete: () => void;
  onStepCorrect?: (index: number) => void;
  dayNumber?: number;
};

const DailyQuiz = ({ questions, onComplete, onStepCorrect, dayNumber = 1 }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const q = questions[currentIndex];

  const onSelect = (i: number) => {
    if (status !== "idle") return;
    setSelectedIndex(i);
    if (i === q.correctIndex) {
      recordCorrectAttempt(dayNumber, currentIndex);
      setStatus("correct");
      if (onStepCorrect) onStepCorrect(currentIndex);
    } else {
      recordWrongAttempt(dayNumber, currentIndex);
      setStatus("wrong");
    }
  };

  const resetCurrent = () => {
    setSelectedIndex(null);
    setStatus("idle");
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((v) => v + 1);
      setSelectedIndex(null);
      setStatus("idle");
    } else {
      onComplete();
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-card shadow-premium">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Quiz do dia</h3>
        <span className="text-xs text-muted-foreground">Pergunta {currentIndex + 1} de {questions.length}</span>
      </div>
      <p className="text-base font-semibold text-foreground mb-4">{q.question}</p>
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          const isSelected = selectedIndex === i;
          const base = "w-full text-left rounded-xl border px-4 py-3 text-sm transition-all";
          const interactive = status === "idle" ? "hover:border-primary/50 hover:bg-primary/5 cursor-pointer" : "opacity-80 cursor-not-allowed";
          const visual =
            status === "idle"
              ? "border-border bg-card"
              : isSelected && status === "correct"
              ? "border-green-600/40 bg-green-500/10"
              : isSelected && status === "wrong"
              ? "border-red-600/40 bg-red-500/10"
              : "border-border bg-card";
          return (
            <button
              key={i}
              disabled={status !== "idle"}
              onClick={() => onSelect(i)}
              className={`${base} ${interactive} ${visual}`}
            >
              <span className="text-foreground">{opt}</span>
            </button>
          );
        })}
      </div>
      {status === "wrong" && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <XCircle className="h-5 w-5" />
            <span className="text-sm font-semibold">Resposta incorreta</span>
          </div>
          <div className="flex justify-end">
            <button onClick={resetCurrent} className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-primary/40">
              Tentar novamente
            </button>
          </div>
        </div>
      )}
      {status === "correct" && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-semibold">Correto</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">{q.verseRef}</p>
            <p>{q.verseText}</p>
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={next} className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium py-2 px-3 hover:opacity-95">
              {currentIndex === questions.length - 1 ? "Concluir" : "Próxima pergunta"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyQuiz;
