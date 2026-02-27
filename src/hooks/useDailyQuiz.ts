import { useCallback, useEffect, useMemo, useState } from "react";
import { bibleQuestions, type BibleQuestion } from "@/data/bibleQuestions";

type QuizItem = BibleQuestion;
type SavedState = {
  dateKey: string;
  index: number;
  score: number;
  answers: number[]; // -1 = not answered, 0..3 option chosen
  order: string[]; // ids in order
};

const STORAGE_KEY = "sentinela_daily_quiz";
const DAILY_COUNT = 8;

const getDateKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let m = a.length;
  while (m) {
    const i = Math.floor(rand(seed) * m--);
    [a[m], a[i]] = [a[i], a[m]];
    seed++;
  }
  return a;
}

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildOrderForToday(): string[] {
  const seed = Number(getDateKey().replace(/-/g, ""));
  const ids = bibleQuestions.map((q) => q.id);
  const shuffled = shuffle(ids, seed);
  return shuffled.slice(0, Math.min(DAILY_COUNT, shuffled.length));
}

function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state: SavedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useDailyQuiz() {
  const [state, setState] = useState<SavedState | null>(null);

  useEffect(() => {
    const s = loadState();
    const key = getDateKey();
    if (s && s.dateKey === key) setState(s);
    else {
      const order = buildOrderForToday();
      setState({
        dateKey: key,
        index: 0,
        score: 0,
        answers: Array(order.length).fill(-1),
        order,
      });
    }
  }, []);

  const items: QuizItem[] = useMemo(() => {
    if (!state) return [];
    const map = new Map(bibleQuestions.map((q) => [q.id, q]));
    return state.order.map((id) => map.get(id)!).filter(Boolean);
  }, [state]);

  const current = state && items[state.index];
  const completed = !!state && state.index >= items.length;

  const answer = useCallback(
    (optionIndex: number) => {
      if (!state || !current) return;
      const isCorrect = optionIndex === current.correctIndex;
      const answers = [...state.answers];
      if (answers[state.index] !== -1) return; // already answered
      answers[state.index] = optionIndex;
      const score = state.score + (isCorrect ? 1 : 0);
      const nextIndex = state.index + 1;
      const newState: SavedState = { ...state, score, answers, index: nextIndex };
      setState(newState);
      saveState(newState);
    },
    [state, current]
  );

  const skip = useCallback(() => {
    if (!state || !current) return;
    const answers = [...state.answers];
    if (answers[state.index] !== -1) return; // already answered
    answers[state.index] = -1;
    const nextIndex = state.index + 1;
    const newState: SavedState = { ...state, answers, index: nextIndex };
    setState(newState);
    saveState(newState);
  }, [state, current]);

  const resetToday = useCallback(() => {
    const order = buildOrderForToday();
    const newState: SavedState = {
      dateKey: getDateKey(),
      index: 0,
      score: 0,
      answers: Array(order.length).fill(-1),
      order,
    };
    setState(newState);
    saveState(newState);
  }, []);

  return {
    items,
    current,
    index: state?.index ?? 0,
    total: items.length,
    score: state?.score ?? 0,
    answers: state?.answers ?? [],
    completed,
    answer,
    resetToday,
    skip,
  };
}
