export type StudyVideo = {
  id: number;
  title: string;
  durationMin: number;
  url: string;
};

export const dailyVideos: StudyVideo[] = [
  { id: 1, title: "Dia 1 — Introdução ao Discernimento", durationMin: 15, url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: 2, title: "Dia 2 — Fundamentos Bíblicos", durationMin: 15, url: "https://www.youtube.com/watch?v=oHg5SJYRHA0" },
  { id: 3, title: "Dia 3 — Análise de Falsas Doutrinas", durationMin: 15, url: "https://www.youtube.com/watch?v=y6120QOlsfU" },
];
