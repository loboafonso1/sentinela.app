import type { DayModule } from "./index";

const mod: DayModule = {
  video_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
  xp_profile: "medium",
  quiz: [
    {
      question: "Cristãos podem ser enganados quando:",
      options: ["Confiam só em carisma", "Examinam tudo pela Bíblia", "Ouvem pastores fiéis", "Buscam aconselhamento sábio"],
      correctIndex: 0,
      verseRef: "Ef 4:14",
      verseText: "Para que não sejamos mais meninos... levados ao redor por todo vento de doutrina.",
    },
    {
      question: "Uma proteção contra engano é:",
      options: ["Isolamento total", "Comunidade saudável", "Seguir tendências", "Desprezar ensino"],
      correctIndex: 1,
      verseRef: "Hb 10:24-25",
      verseText: "Consideremo-nos... não deixando nossa congregação.",
    },
    {
      question: "A medida final sempre será:",
      options: ["Experiência pessoal", "A Palavra de Deus", "Opinião da maioria", "Autoridade cultural"],
      correctIndex: 1,
      verseRef: "Is 8:20",
      verseText: "À lei e ao testemunho! Se eles não falarem segundo esta palavra...",
    },
  ],
};

export default mod;
