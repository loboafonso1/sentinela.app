import type { DayModule } from "./index";

const mod: DayModule = {
  title: "Por que bons cristãos são enganados",
  video_url: "https://www.youtube.com/shorts/aFO8Y__s9Bw",
  xp_profile: "medium",
  quiz: [
    {
      question: "Por que cristãos comprometidos com a fé podem, ainda assim, ser influenciados por ensinos distorcidos?",
      options: [
        "Porque priorizam experiências espirituais acima da avaliação cuidadosa das Escrituras.",
        "Porque confundem fidelidade emocional com fidelidade doutrinária.",
        "Porque pressupõem que toda liderança cristã é automaticamente confiável.",
        "Porque zelo sincero não substitui exame constante à luz da Palavra."
      ],
      correctIndex: 3,
      verseRef: "At 17:11",
      verseText: "Examinavam diariamente as Escrituras para ver se as coisas eram assim.",
    },
    {
      question: "Qual fator abaixo mais contribui para que um bom cristão aceite um ensino distorcido?",
      options: [
        "Confiança excessiva na autoridade do líder, sem examinar as Escrituras.",
        "Desejo de servir mais ativamente na igreja.",
        "Interesse por crescimento espiritual.",
        "Participação frequente em estudos bíblicos."
      ],
      correctIndex: 0,
      verseRef: "1Jo 4:1",
      verseText: "Não creiais a todo espírito, mas provai se os espíritos são de Deus.",
    },
    {
      question: "Um ensino com aparência piedosa, mas que altera sutilmente o conteúdo bíblico, torna-se perigoso principalmente porque:",
      options: [
        "Parece coerente com valores cristãos superficiais.",
        "Usa linguagem espiritual convincente enquanto distorce a verdade central.",
        "É ensinado por pessoas carismáticas.",
        "Promete crescimento numérico da igreja."
      ],
      correctIndex: 1,
      verseRef: "2Co 11:13-14",
      verseText: "Falsos apóstolos... o próprio Satanás se transfigura em anjo de luz.",
    },
  ],
};

export default mod;
