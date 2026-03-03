import type { DayModule } from "./index";

const mod: DayModule = {
  title: "Diferença entre opinião e heresia",
  video_url: "https://www.youtube.com/shorts/nWX6EcHmt9Q",
  xp_profile: "medium",
  quiz: [
    {
      question: "Qual das situações abaixo caracteriza heresia e não apenas uma opinião teológica diferente?",
      options: [
        "Divergência sobre detalhes escatológicos.",
        "Debate sobre forma de governo da igreja.",
        "Negação da divindade de Cristo.",
        "Diferença de entendimento sobre estilo de culto."
      ],
      correctIndex: 2,
      verseRef: "Jo 1:1; Cl 2:9",
      verseText: "No princípio era o Verbo... e o Verbo era Deus; em Cristo habita corporalmente toda a plenitude da divindade.",
    },
    {
      question: "Uma opinião teológica legítima pode ser definida como:",
      options: [
        "Interpretação diferente em assuntos não centrais da fé cristã.",
        "Alteração de doutrinas históricas fundamentais.",
        "Rejeição parcial da autoridade bíblica.",
        "Nova revelação que supera o ensino apostólico."
      ],
      correctIndex: 0,
      verseRef: "Rm 14:1-5",
      verseText: "Quanto ao que é fraco na fé, recebei-o, mas não para contendas sobre dúvidas.",
    },
    {
      question: "Quando um ensino modifica verdades consideradas essenciais pela fé cristã histórica, isso deve ser entendido como:",
      options: [
        "Evolução natural da teologia.",
        "Adaptação cultural necessária.",
        "Diversidade doutrinária aceitável.",
        "Heresia, por comprometer fundamentos centrais da fé."
      ],
      correctIndex: 3,
      verseRef: "Gl 1:8-9; Jd 3",
      verseText: "Ainda que um anjo... pregue outro evangelho, seja anátema; batalhai pela fé que foi uma vez entregue aos santos.",
    },
  ],
};

export default mod;
