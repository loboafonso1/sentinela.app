import { registerDay, type DayModule } from "./index";

const mod: DayModule = {
  video_url: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
  xp_profile: "easy",
  quiz: [
    {
      question: "Discernimento bíblico começa com:",
      options: ["Opiniões populares", "Escrituras como padrão final", "Experiências pessoais", "Tradições locais"],
      correctIndex: 1,
      verseRef: "Hb 5:14",
      verseText: "Os adultos... têm as faculdades exercitadas para discernir o bem e o mal.",
    },
    {
      question: "A base segura para avaliar doutrinas é:",
      options: ["Carisma do pregador", "Bíblia no contexto", "Tamanho da igreja", "Testemunhos emocionantes"],
      correctIndex: 1,
      verseRef: "At 17:11",
      verseText: "Examinavam diariamente as Escrituras para ver se as coisas eram assim.",
    },
    {
      question: "O Espírito Santo nos guia:",
      options: ["A toda verdade", "A prosperidade terrena", "A experiências místicas", "A tradições humanas"],
      correctIndex: 0,
      verseRef: "Jo 16:13",
      verseText: "Quando vier o Espírito da verdade, ele vos guiará em toda a verdade.",
    },
  ],
};

registerDay(2, mod);
export default mod;
