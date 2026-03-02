import { registerDay, type DayModule } from "./index";

const mod: DayModule = {
  video_url: "https://www.youtube.com/watch?v=y6120QOlsfU",
  xp_profile: "easy",
  quiz: [
    {
      question: "Um primeiro sinal de erro doutrinário é:",
      options: ["Uso de exemplos", "Textos fora de contexto", "Entonação diferente", "Estilo musical"],
      correctIndex: 1,
      verseRef: "2Pe 3:16",
      verseText: "Os ignorantes e instáveis... deturpam as Escrituras para sua própria destruição.",
    },
    {
      question: "Devemos julgar ensinos pela:",
      options: ["Coerência com a Escritura", "Aparência do mensageiro", "Tradição familiar", "Popularidade online"],
      correctIndex: 0,
      verseRef: "1Ts 5:21",
      verseText: "Examinai tudo; retende o bem.",
    },
    {
      question: "Evitar ‘meias verdades’ requer:",
      options: ["Contexto bíblico", "Frases de efeito", "Autoridade humana", "Experiência pessoal"],
      correctIndex: 0,
      verseRef: "2Tm 2:15",
      verseText: "Maneja bem a palavra da verdade.",
    },
  ],
};

registerDay(3, mod);
export default mod;
