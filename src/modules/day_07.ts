import { registerDay, type DayModule } from "./index";

const mod: DayModule = {
  video_url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
  xp_profile: "hard",
  quiz: [
    {
      question: "Textos fora de contexto geram:",
      options: ["Heresias e confusões", "Clareza bíblica", "Unidade doutrinária", "Exposição fiel"],
      correctIndex: 0,
      verseRef: "2Tm 2:15",
      verseText: "Maneja bem a palavra da verdade.",
    },
    {
      question: "A regra principal de interpretação é:",
      options: ["Contexto imediato e bíblico", "Significado moderno", "Preferência pessoal", "Tradição local"],
      correctIndex: 0,
      verseRef: "Lc 24:27",
      verseText: "Começando por Moisés e todos os profetas, explicou... o que a seu respeito constava em todas as Escrituras.",
    },
    {
      question: "Devemos confirmar textos difíceis por:",
      options: ["Textos claros", "Experiência", "Autoridade de homens", "Tendências atuais"],
      correctIndex: 0,
      verseRef: "2Pe 1:20-21",
      verseText: "Nenhuma profecia da Escritura é de particular interpretação.",
    },
  ],
};

registerDay(7, mod);
export default mod;
