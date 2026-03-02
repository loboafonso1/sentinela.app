import type { DayModule } from "./index";

const mod: DayModule = {
  video_url: "https://www.youtube.com/watch?v=M3wgaWAHo2Q",
  xp_profile: "medium",
  quiz: [
    {
      question: "Opiniões pessoais se tornam heresia quando:",
      options: ["São pregadas com paixão", "Negam doutrinas centrais", "São novas para alguns", "Usam termos técnicos"],
      correctIndex: 1,
      verseRef: "Gl 1:8",
      verseText: "Se alguém vos anunciar outro evangelho... seja anátema.",
    },
    {
      question: "Doutrinas centrais incluem:",
      options: ["Preferências de culto", "Trindade e pessoa de Cristo", "Tradições regionais", "Questões secundárias"],
      correctIndex: 1,
      verseRef: "Mt 28:19; Cl 2:9",
      verseText: "Três Pessoas, um só Deus; em Cristo habita corporalmente toda a plenitude da divindade.",
    },
    {
      question: "A igreja deve:",
      options: ["Evitar confrontos sempre", "Proteger a sã doutrina", "Aceitar todo ensino", "Seguir consensos culturais"],
      correctIndex: 1,
      verseRef: "Tt 1:9",
      verseText: "Apegar-se à fiel palavra... para exortar pelo reto ensino e convencer os que contradizem.",
    },
  ],
};

export default mod;
