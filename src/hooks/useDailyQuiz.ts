import { useMemo, useState } from "react";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

const defaultQuestions: QuizQuestion[] = [
  { id: "q1", question: "Pergunta diária", options: ["A", "B", "C"], correctIndex: 0 },
  { id: "q2", question: "Pergunta diária", options: ["A", "B", "C"], correctIndex: 1 },
  { id: "q3", question: "Pergunta diária", options: ["A", "B", "C"], correctIndex: 2 },
];

export function useDailyQuiz() {
  const questions = useMemo(() => defaultQuestions, []);
  const [index, setIndex] = useState(0);

  const total = questions.length;
  const current = questions[Math.min(index, total - 1)];

  const answer = (selectedIndex: number) => {
    const _correct = current?.correctIndex === selectedIndex;
    setIndex((v) => Math.min(v + 1, total));
    return _correct;
  };

  return { total, index, current, answer };
}

