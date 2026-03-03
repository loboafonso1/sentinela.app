import type { DayModule } from "./index";

const mod: DayModule = {
  title: "Textos fora de contexto",
  video_url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
  xp_profile: "hard",
  quiz: [
    {
      question: "Quando um versículo é usado isoladamente para sustentar uma doutrina sem considerar seu contexto imediato, isso caracteriza:",
      options: [
        "Aplicação devocional legítima.",
        "Síntese teológica prática.",
        "Uso inadequado do texto bíblico por desconsiderar o contexto.",
        "Interpretação simbólica aceitável."
      ],
      correctIndex: 2,
      verseRef: "2Pe 3:16",
      verseText: "Os ignorantes e instáveis deturpam as Escrituras para sua própria destruição.",
    },
    {
      question: "Qual é o princípio mais seguro para evitar distorções ao interpretar um texto bíblico?",
      options: [
        "Priorizar a experiência pessoal ao ler o texto.",
        "Interpretar a passagem à luz do contexto histórico, literário e do ensino geral das Escrituras.",
        "Buscar aplicações modernas que tornem o texto mais relevante.",
        "Confiar na tradição predominante da maioria."
      ],
      correctIndex: 1,
      verseRef: "Lc 24:27",
      verseText: "Começando por Moisés e todos os profetas, explicou o que a seu respeito constava em todas as Escrituras.",
    },
    {
      question: "Um ensino que ignora o propósito original do autor bíblico para sustentar uma ideia atual demonstra:",
      options: [
        "Criatividade interpretativa.",
        "Atualização necessária da mensagem.",
        "Adaptação pastoral contemporânea.",
        "Desvio hermenêutico ao alterar a intenção original do texto."
      ],
      correctIndex: 3,
      verseRef: "2Pe 1:20-21",
      verseText: "Nenhuma profecia da Escritura é de particular interpretação.",
    },
  ],
};

export default mod;
