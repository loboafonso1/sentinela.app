export type BibleQuestion = {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // short biblical explanation with references
  refs: string[]; // scripture references
};

// Carefully curated, concise, and theologically orthodox statements with references.
export const bibleQuestions: BibleQuestion[] = [
  {
    id: "tri-001",
    category: "Trindade",
    question: "A doutrina bíblica ensina que o Pai, o Filho e o Espírito Santo são:",
    options: [
      "Três manifestações de um único Deus, em momentos distintos",
      "Três pessoas distintas, um só Deus",
      "Três deuses diferentes em união",
      "Anjos superiores usados por Deus",
    ],
    correctIndex: 1,
    explanation:
      "A Trindade bíblica ensina três Pessoas distintas e co-eternas, de uma mesma essência divina.",
    refs: ["Mt 28:19", "2Co 13:13", "Jo 1:1"],
  },
  {
    id: "evp-001",
    category: "Evangelho da Prosperidade",
    question: "Segundo as Escrituras, a principal promessa do evangelho é:",
    options: [
      "Riqueza material para quem tem fé suficiente",
      "Isenção de doenças e sofrimentos",
      "Reconciliação com Deus e vida eterna em Cristo",
      "Liderança e influência nesta vida",
    ],
    correctIndex: 2,
    explanation:
      "A mensagem central é reconciliação com Deus e vida eterna em Cristo, não prosperidade garantida.",
    refs: ["Jo 3:16", "2Co 5:18-19", "Ef 1:7"],
  },
  {
    id: "sal-001",
    category: "Salvação",
    question: "A salvação, de acordo com o Novo Testamento, é:",
    options: [
      "Conquistada por boas obras e esforços pessoais",
      "Alcançada por fé em Cristo, resultando em boas obras",
      "Obtida por meio de rituais obrigatórios",
      "Uma possibilidade incerta mesmo após crer",
    ],
    correctIndex: 1,
    explanation:
      "Somos salvos pela graça, mediante a fé, e criados para boas obras como fruto da salvação.",
    refs: ["Ef 2:8-10", "Rm 3:24", "Tt 3:5"],
  },
  {
    id: "escrit-001",
    category: "Autoridade das Escrituras",
    question: "A Bíblia é a regra final de fé e prática porque:",
    options: [
      "É um compêndio humano de sabedoria religiosa",
      "Contém tradições suficientes da igreja",
      "É a Palavra inspirada por Deus e suficiente",
      "Foi aprovada por concílios antigos",
    ],
    correctIndex: 2,
    explanation:
      "A Escritura é inspirada por Deus e suficiente para ensinar, corrigir e instruir na justiça.",
    refs: ["2Tm 3:16-17", "2Pe 1:21"],
  },
  {
    id: "cristo-001",
    category: "Cristologia",
    question: "Biblicamente, Jesus Cristo é:",
    options: [
      "Um grande profeta, mas não Deus",
      "Deus Filho encarnado, plenamente Deus e plenamente homem",
      "Um ser criado superior aos anjos",
      "Uma ideia espiritual, não uma pessoa real",
    ],
    correctIndex: 1,
    explanation:
      "Jesus é o Verbo que se fez carne: Deus Filho encarnado, 100% Deus e 100% homem.",
    refs: ["Jo 1:1,14", "Cl 2:9", "Hb 1:3"],
  },
  {
    id: "arre-001",
    category: "Arrependimento e Fé",
    question: "O arrependimento bíblico é melhor descrito como:",
    options: [
      "Sentir culpa intensa sem mudança de vida",
      "Mudar de mente e direção, voltando-se para Deus",
      "Prometer obras para merecer perdão",
      "Sofrer para pagar pecados passados",
    ],
    correctIndex: 1,
    explanation:
      "Arrependimento é uma mudança de mente e direção, produzindo frutos dignos de uma vida em Deus.",
    refs: ["At 2:38", "At 20:21", "Mt 3:8"],
  },
  {
    id: "igreja-001",
    category: "Igreja",
    question: "A igreja, segundo o Novo Testamento, é:",
    options: [
      "Um templo físico onde Deus habita exclusivamente",
      "Um movimento social de reforma",
      "O povo redimido, corpo de Cristo, em todas as nações",
      "A soma de líderes eclesiásticos",
    ],
    correctIndex: 2,
    explanation:
      "A igreja é o povo de Deus, corpo de Cristo, formado por todos os que creem em Cristo.",
    refs: ["Ef 1:22-23", "1Pe 2:9"],
  },
  {
    id: "falso-ens-001",
    category: "Falsos Ensinos",
    question: "Como o cristão deve avaliar ensinamentos suspeitos?",
    options: [
      "Aceitar se o pregador é carismático",
      "Julgar por experiências pessoais",
      "Provar pela Escritura e pelo contexto bíblico",
      "Evitar questionar para não ‘julgar’",
    ],
    correctIndex: 2,
    explanation:
      "Devemos examinar tudo à luz das Escrituras e reter o que é bom, rejeitando o erro.",
    refs: ["1Ts 5:21", "At 17:11"],
  },
  {
    id: "esp-001",
    category: "Obra do Espírito Santo",
    question: "A principal obra do Espírito Santo quanto a Cristo é:",
    options: [
      "Exaltar a experiência humana",
      "Glorificar a Cristo e convencer do pecado, justiça e juízo",
      "Garantir prosperidade visível",
      "Substituir a Bíblia por revelações modernas",
    ],
    correctIndex: 1,
    explanation:
      "O Espírito glorifica a Cristo, aplica a salvação e convence o mundo do pecado, justiça e juízo.",
    refs: ["Jo 16:8-14"],
  },
  {
    id: "sant-001",
    category: "Santificação",
    question: "A santificação na vida cristã é:",
    options: [
      "Opcional, apenas para líderes",
      "Resultado inevitável do novo nascimento e obediência",
      "Alcançada de uma vez por autoesforço",
      "Irrelevante após a fé",
    ],
    correctIndex: 1,
    explanation:
      "Deus nos chama à santidade; crescemos pela Palavra e pelo Espírito, obedecendo a Cristo.",
    refs: ["1Ts 4:3", "Jo 17:17", "Gl 5:16"],
  },
];
