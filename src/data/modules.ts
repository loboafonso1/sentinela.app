export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Module {
  day: number;
  title: string;
  subtitle: string;
  situation: {
    title: string;
    content: string;
  };
  biblical: {
    passage: string;
    reference: string;
    context: string;
  };
  comparison: {
    correct: string;
    distortion: string;
  };
  quiz: QuizQuestion[];
  conclusion: string;
}

export const modules: Module[] = [
  {
    day: 1,
    title: "Fundamentos do Discernimento",
    subtitle: "A base bíblica para examinar tudo",
    situation: {
      title: "O pregador das redes sociais",
      content: "Um pregador famoso publica: 'Deus me revelou que quem seguir este ministério terá uma vida sem problemas. Apenas creia!' Milhões compartilham sem questionar. Mas será que isso resiste ao exame das Escrituras?",
    },
    biblical: {
      passage: "Amados, não creiais em todo espírito, mas provai se os espíritos são de Deus, porque já muitos falsos profetas se têm levantado no mundo.",
      reference: "1 João 4:1",
      context: "O apóstolo João escreveu no final do primeiro século, quando falsos mestres infiltravam as igrejas com doutrinas que misturavam filosofia grega com o evangelho. A urgência era clara: a igreja precisava aprender a testar tudo.",
    },
    comparison: {
      correct: "Discernimento bíblico é a capacidade de avaliar ensinos, pregações e práticas à luz das Escrituras, comparando tudo com a Palavra de Deus antes de aceitar. É um exercício ativo, não passivo.",
      distortion: "Muitos acreditam que discernimento é um 'dom especial' que poucos recebem, ou que questionar líderes é falta de fé. Na verdade, a Bíblia ORDENA que todos examinem e testem.",
    },
    quiz: [
      {
        question: "O que significa 'examinar tudo' segundo 1 Tessalonicenses 5:21?",
        options: [
          "Aceitar tudo que vem de líderes reconhecidos",
          "Avaliar ensinos à luz das Escrituras antes de aceitar",
          "Confiar apenas na sua intuição espiritual",
          "Rejeitar tudo que é novo",
        ],
        correctIndex: 1,
        explanation: "'Examinai tudo. Retende o bem.' Paulo instrui os cristãos a testar TUDO – não apenas o que parece suspeito, mas todo ensino – usando as Escrituras como critério.",
      },
      {
        question: "Por que João alertou sobre 'provar os espíritos'?",
        options: [
          "Porque todos os pregadores são falsos",
          "Porque falsos profetas já atuavam nas igrejas",
          "Porque a Bíblia não era confiável na época",
          "Porque o Espírito Santo não guia mais",
        ],
        correctIndex: 1,
        explanation: "João alertou porque falsos mestres já estavam dentro das comunidades cristãs, ensinando doutrinas que pareciam espirituais mas contradiziam o evangelho.",
      },
      {
        question: "Discernimento bíblico é principalmente:",
        options: [
          "Um dom sobrenatural dado apenas a pastores",
          "Uma habilidade que se desenvolve com estudo e prática",
          "A capacidade de prever o futuro",
          "Saber identificar demônios",
        ],
        correctIndex: 1,
        explanation: "Embora exista o dom de discernimento (1 Co 12:10), todo cristão é chamado a desenvolver discernimento através do estudo das Escrituras (Hebreus 5:14).",
      },
    ],
    conclusion: "Hoje você deu o primeiro passo para fortalecer seu filtro espiritual. Discernimento não é desconfiança — é sabedoria bíblica em ação.",
  },
  {
    day: 2,
    title: "Manipulação Emocional",
    subtitle: "Quando o sentimento substitui a Escritura",
    situation: {
      title: "O culto emocionante",
      content: "Em um culto lotado, o pastor diz: 'Se você sentiu arrepios, é porque Deus está confirmando esta palavra!' A congregação chora, grita e aceita tudo sem questionar. Mas emoção é sempre confirmação divina?",
    },
    biblical: {
      passage: "Enganoso é o coração, mais do que todas as coisas, e perverso; quem o conhecerá?",
      reference: "Jeremias 17:9",
      context: "Jeremias profetizou durante os últimos anos do reino de Judá, quando o povo seguia seus próprios desejos e falsos profetas que diziam 'paz, paz' quando não havia paz. O coração enganoso levava o povo a aceitar mentiras confortáveis.",
    },
    comparison: {
      correct: "Emoções são parte da experiência cristã legítima, mas nunca devem ser o CRITÉRIO para validar verdade. A verdade é objetiva e baseada nas Escrituras, independente do que sentimos.",
      distortion: "A distorção moderna diz: 'Se você sentiu, é de Deus.' Isso inverte a ordem bíblica. Primeiro vem a verdade (Escritura), depois pode vir a emoção como resposta – nunca o contrário.",
    },
    quiz: [
      {
        question: "Segundo Jeremias 17:9, por que não devemos confiar apenas nas emoções?",
        options: [
          "Porque emoções são pecado",
          "Porque o coração é enganoso",
          "Porque Deus não se importa com emoções",
          "Porque só a razão importa",
        ],
        correctIndex: 1,
        explanation: "O profeta não condena emoções, mas alerta que o coração humano pode nos enganar. Por isso precisamos de um padrão objetivo: a Palavra de Deus.",
      },
      {
        question: "Qual a ordem correta no discernimento bíblico?",
        options: [
          "Sentir → Crer → Verificar",
          "Verificar na Escritura → Crer → Responder com emoção",
          "Ouvir o líder → Aceitar → Não questionar",
          "Ter uma experiência → Buscar versículos que confirmem",
        ],
        correctIndex: 1,
        explanation: "A ordem bíblica é: primeiro examinar à luz da Escritura, depois crer no que é verdadeiro, e então responder – inclusive emocionalmente.",
      },
      {
        question: "Arrepios durante uma pregação significam que:",
        options: [
          "Deus está confirmando a mensagem",
          "O Espírito Santo está presente",
          "Pode ser apenas uma reação emocional que precisa ser avaliada",
          "O pregador tem unção especial",
        ],
        correctIndex: 2,
        explanation: "Reações físicas podem ter diversas causas. A Bíblia nunca usa arrepios como critério de verdade. O critério é sempre: está de acordo com as Escrituras?",
      },
    ],
    conclusion: "Emoções são presentes de Deus, mas filtro espiritual se constrói com verdade, não com sentimentos. Hoje você fortaleceu seu discernimento contra manipulação emocional.",
  },
  {
    day: 3,
    title: "Versículos Fora de Contexto",
    subtitle: "A armadilha mais comum nas pregações modernas",
    situation: {
      title: "O versículo motivacional",
      content: "Nas redes sociais, um post viral diz: 'Tudo posso naquele que me fortalece! Reclame seu carro novo, sua casa, sua promoção!' Filipenses 4:13 é um dos versículos mais distorcidos. O que Paulo realmente quis dizer?",
    },
    biblical: {
      passage: "Sei estar abatido e sei também ter abundância; em toda a maneira e em todas as coisas, estou instruído, tanto a ter fartura como a ter fome, tanto a ter abundância como a padecer necessidade. Posso todas as coisas naquele que me fortalece.",
      reference: "Filipenses 4:12-13",
      context: "Paulo escreveu esta carta da prisão. Ele não falava de conquistar bens materiais, mas de suportar qualquer circunstância — inclusive fome e necessidade — com a força que Cristo dá. O contexto é de contentamento, não de ambição.",
    },
    comparison: {
      correct: "Paulo fala sobre a capacidade de enfrentar qualquer situação — boa ou ruim — com a força de Cristo. É sobre contentamento e resiliência espiritual, não sobre 'poder para conquistar tudo que quiser'.",
      distortion: "A distorção transforma um texto sobre contentamento na adversidade em uma declaração de poder pessoal para obter bens materiais. Ignora que Paulo estava preso e passando necessidade quando escreveu isso.",
    },
    quiz: [
      {
        question: "Qual era a situação de Paulo quando escreveu Filipenses 4:13?",
        options: [
          "Estava rico e bem-sucedido",
          "Estava em uma conferência de sucesso",
          "Estava preso e passando necessidade",
          "Estava plantando uma mega-igreja",
        ],
        correctIndex: 2,
        explanation: "Paulo escreveu Filipenses da prisão, provavelmente em Roma. Ele estava em cadeias, não em uma posição de poder ou conforto material.",
      },
      {
        question: "'Tudo posso' em Filipenses 4:13 se refere a:",
        options: [
          "Conquistar qualquer bem material",
          "Suportar qualquer circunstância com a força de Cristo",
          "Ter poder sobrenatural para fazer milagres",
          "Alcançar qualquer objetivo pessoal",
        ],
        correctIndex: 1,
        explanation: "O contexto dos versículos 11-12 deixa claro: Paulo fala de suportar fome, necessidade, abundância e escassez — qualquer circunstância — pela força que Cristo dá.",
      },
      {
        question: "Para evitar tirar versículos do contexto, devemos:",
        options: [
          "Ler apenas o versículo isolado",
          "Ler os versículos ao redor e entender a situação do autor",
          "Aceitar a interpretação do pregador sem questionar",
          "Buscar apenas versículos que confirmem o que queremos",
        ],
        correctIndex: 1,
        explanation: "Contexto é rei na interpretação bíblica. Sempre leia os versículos antes e depois, entenda quem escreveu, para quem, quando e por quê.",
      },
    ],
    conclusion: "Um versículo sem contexto se torna um pretexto. Hoje você aprendeu a identificar uma das heresias mais comuns do nosso tempo.",
  },
  {
    day: 4,
    title: "Teologia da Prosperidade",
    subtitle: "Quando o evangelho vira moeda de troca",
    situation: {
      title: "A oferta da bênção",
      content: "O pastor diz no culto: 'Deus quer que todos sejam ricos! Se você não prospera financeiramente, é porque não tem fé suficiente. Plante uma semente de R$1.000 e Deus vai multiplicar!' Essa é uma pregação bíblica?",
    },
    biblical: {
      passage: "Porque o amor ao dinheiro é a raiz de toda espécie de males; e nessa cobiça alguns se desviaram da fé e se traspassaram a si mesmos com muitas dores.",
      reference: "1 Timóteo 6:10",
      context: "Paulo instruía Timóteo sobre falsos mestres que usavam a piedade como fonte de lucro. No primeiro século, já existiam pregadores que distorciam o evangelho para enriquecer, explorando a fé dos mais simples.",
    },
    comparison: {
      correct: "A Bíblia ensina generosidade, trabalho honesto e contentamento. Deus pode abençoar materialmente, mas riqueza nunca é prometida como resultado automático da fé. Jesus e os apóstolos viveram com simplicidade.",
      distortion: "O 'evangelho da prosperidade' inverte as prioridades bíblicas: transforma Deus em um meio para fins materiais, culpa o sofredor por 'falta de fé' e ignora que Jesus disse 'No mundo tereis aflições' (Jo 16:33).",
    },
    quiz: [
      {
        question: "Segundo 1 Timóteo 6:10, qual é a raiz de toda espécie de males?",
        options: [
          "O dinheiro em si",
          "O amor ao dinheiro",
          "Ser pobre",
          "Não ofertar o suficiente",
        ],
        correctIndex: 1,
        explanation: "Note: não é o dinheiro, mas o AMOR ao dinheiro. A ganância e a cobiça são o problema, não a existência de recursos financeiros.",
      },
      {
        question: "Jesus prometeu que seus seguidores seriam:",
        options: [
          "Ricos e bem-sucedidos financeiramente",
          "Livres de qualquer sofrimento",
          "Perseguidos por causa da justiça",
          "Donos de grandes propriedades",
        ],
        correctIndex: 2,
        explanation: "Em Mateus 5:10-11, Jesus disse: 'Bem-aventurados os que sofrem perseguição por causa da justiça.' O evangelho nunca prometeu uma vida sem dificuldades.",
      },
      {
        question: "Um pregador que diz 'se você não prospera é falta de fé' está:",
        options: [
          "Ensinando verdade bíblica",
          "Motivando as pessoas corretamente",
          "Culpando a vítima e distorcendo o evangelho",
          "Aplicando Malaquias 3:10 corretamente",
        ],
        correctIndex: 2,
        explanation: "Essa lógica culpa pessoas que sofrem e ignora que Jó, Paulo e o próprio Jesus passaram por sofrimento intenso sem 'falta de fé'. É uma distorção grave.",
      },
    ],
    conclusion: "O verdadeiro evangelho não tem preço. Hoje você aprendeu a identificar quando a fé é usada como moeda de troca — uma das heresias mais perigosas da atualidade.",
  },
  {
    day: 5,
    title: "Falsas Revelações",
    subtitle: "Quando 'Deus me disse' substitui a Bíblia",
    situation: {
      title: "A profecia manipuladora",
      content: "Um líder declara: 'Deus me revelou diretamente que vocês devem fazer isto. Quem desobedecer está resistindo ao Espírito Santo!' Revelações pessoais podem ter mais autoridade que as Escrituras?",
    },
    biblical: {
      passage: "Havendo Deus, outrora, falado, muitas vezes e de muitas maneiras, aos pais, pelos profetas, nestes últimos dias, nos falou pelo Filho.",
      reference: "Hebreus 1:1-2",
      context: "O autor de Hebreus estabelece que a revelação suprema e final de Deus é Jesus Cristo, conforme registrado nas Escrituras. A Bíblia é a revelação completa e suficiente para fé e prática.",
    },
    comparison: {
      correct: "Deus pode falar ao coração do crente pelo Espírito Santo, mas qualquer 'revelação' deve ser testada pelas Escrituras. Nenhuma revelação pessoal pode contradizer, adicionar ou substituir a Bíblia.",
      distortion: "A distorção coloca revelações pessoais no mesmo nível ou acima da Bíblia. Quando um líder diz 'Deus me revelou' para manipular, ele está usando a autoridade divina para impor sua vontade.",
    },
    quiz: [
      {
        question: "Segundo Hebreus 1:1-2, qual é a revelação final de Deus?",
        options: [
          "As profecias modernas",
          "Os sonhos dos pastores",
          "Jesus Cristo, registrado nas Escrituras",
          "As experiências pessoais",
        ],
        correctIndex: 2,
        explanation: "O autor de Hebreus é claro: a revelação suprema é Jesus, conforme registrado nas Escrituras. Tudo mais deve ser avaliado à luz dessa revelação.",
      },
      {
        question: "Se alguém diz 'Deus me revelou algo' que contradiz a Bíblia, você deve:",
        options: [
          "Aceitar porque a pessoa é ungida",
          "Rejeitar, pois Deus não contradiz Sua Palavra",
          "Acreditar se a pessoa é um líder reconhecido",
          "Esperar confirmação em um sonho",
        ],
        correctIndex: 1,
        explanation: "Deus não se contradiz. Se uma suposta revelação vai contra o ensino claro das Escrituras, não é de Deus (Gálatas 1:8).",
      },
      {
        question: "Qual o problema de usar 'Deus me disse' para controlar pessoas?",
        options: [
          "Nenhum, se a pessoa realmente ouviu de Deus",
          "É manipulação espiritual que usa a autoridade divina indevidamente",
          "É aceitável se o líder tem boas intenções",
          "Só é problema se a pessoa mentir",
        ],
        correctIndex: 1,
        explanation: "Usar 'Deus me disse' para manipular pessoas é abuso espiritual. Remove o direito da pessoa de examinar e tomar decisões baseadas nas Escrituras.",
      },
    ],
    conclusion: "A Bíblia é a régua que mede toda revelação. Hoje você fortaleceu sua capacidade de identificar falsos profetas e suas táticas.",
  },
  {
    day: 6,
    title: "Relativismo Teológico",
    subtitle: "Quando a cultura molda a teologia",
    situation: {
      title: "A adaptação perigosa",
      content: "Um teólogo popular defende: 'A Bíblia precisa ser reinterpretada para cada geração. O que era pecado ontem pode não ser hoje, porque a cultura mudou.' A cultura deve determinar o que a Bíblia ensina?",
    },
    biblical: {
      passage: "Jesus Cristo é o mesmo ontem, e hoje, e eternamente. Não vos deixeis levar em redor por doutrinas várias e estranhas.",
      reference: "Hebreus 13:8-9",
      context: "O autor alerta os cristãos contra doutrinas mutáveis que se adaptam a cada tendência. A imutabilidade de Cristo é o fundamento: se Ele não muda, Sua verdade também não.",
    },
    comparison: {
      correct: "A aplicação da Bíblia pode considerar o contexto cultural, mas os princípios morais e teológicos são eternos. Contextualizar é diferente de relativizar. A verdade se aplica em todas as culturas.",
      distortion: "A distorção usa a 'evolução cultural' para descartar ensinos bíblicos inconvenientes. Redefine pecado segundo a cultura em vez de manter o padrão bíblico.",
    },
    quiz: [
      {
        question: "Segundo Hebreus 13:8, Jesus Cristo é:",
        options: [
          "Adaptável a cada geração",
          "O mesmo ontem, hoje e eternamente",
          "Diferente em cada cultura",
          "Reinterpretável conforme a época",
        ],
        correctIndex: 1,
        explanation: "A imutabilidade de Cristo implica que Sua verdade também não muda. Os princípios bíblicos são eternos, mesmo que a aplicação considere o contexto.",
      },
      {
        question: "Qual a diferença entre contextualizar e relativizar a Bíblia?",
        options: [
          "Não há diferença",
          "Contextualizar aplica princípios eternos; relativizar muda os princípios",
          "Relativizar é mais avançado teologicamente",
          "Contextualizar é ultrapassado",
        ],
        correctIndex: 1,
        explanation: "Contextualizar mantém o princípio e adapta a comunicação. Relativizar muda o próprio princípio para agradar a cultura — isso é distorção.",
      },
      {
        question: "Se a cultura muda, os princípios bíblicos:",
        options: [
          "Também devem mudar",
          "Permanecem os mesmos, pois são eternos",
          "Perdem a relevância",
          "Precisam ser votados pela igreja",
        ],
        correctIndex: 1,
        explanation: "A Palavra de Deus permanece para sempre (Isaías 40:8). Os princípios morais e teológicos não são determinados pela cultura, mas por Deus.",
      },
    ],
    conclusion: "A verdade não se dobra à cultura — a cultura é que deve ser avaliada pela verdade. Hoje você aprendeu a refutar o relativismo teológico.",
  },
  {
    day: 7,
    title: "Identificando Falsos Profetas",
    subtitle: "Avaliação de discursos e pregações contemporâneas",
    situation: {
      title: "O profeta das multidões",
      content: "Um líder religioso reúne milhões de seguidores com promessas de cura, riqueza e revelações exclusivas. Sua doutrina mistura elementos bíblicos com práticas estranhas. Como avaliar se alguém é um verdadeiro ou falso profeta?",
    },
    biblical: {
      passage: "Acautelai-vos, porém, dos falsos profetas, que vêm até vós vestidos como ovelhas, mas interiormente são lobos devoradores. Por seus frutos os conhecereis.",
      reference: "Mateus 7:15-16",
      context: "Jesus alertou no Sermão do Monte sobre falsos profetas que se disfarçam. O critério que Ele deu não é a aparência exterior, a eloquência ou os sinais, mas os frutos — caráter, doutrina e resultado do ministério.",
    },
    comparison: {
      correct: "Falsos profetas são identificados pelos seus frutos: doutrina inconsistente com as Escrituras, vida pessoal contraditória, enriquecimento às custas dos fiéis, manipulação emocional e autoritarismo.",
      distortion: "Muitos acreditam que sinais, milagres e multidões validam um profeta. Mas Jesus alertou que falsos profetas fariam sinais e maravilhas para enganar até os escolhidos (Mateus 24:24).",
    },
    quiz: [
      {
        question: "Segundo Mateus 7:15-16, como identificar falsos profetas?",
        options: [
          "Pelo tamanho do ministério",
          "Pelos sinais e milagres que realizam",
          "Pelos seus frutos (doutrina, caráter, resultados)",
          "Pela quantidade de seguidores",
        ],
        correctIndex: 2,
        explanation: "Jesus foi claro: 'Pelos seus frutos os conhecereis.' Os frutos incluem doutrina fiel às Escrituras, caráter cristão e resultados que glorificam a Deus — não o líder.",
      },
      {
        question: "Sinais e milagres são garantia de que um profeta é verdadeiro?",
        options: [
          "Sim, sempre",
          "Não, pois falsos profetas também podem fazer sinais (Mt 24:24)",
          "Sim, se acompanhados de multidões",
          "Depende da denominação",
        ],
        correctIndex: 1,
        explanation: "Jesus alertou que falsos cristos e falsos profetas fariam sinais e prodígios para enganar. Sinais não são critério suficiente — a doutrina é o teste definitivo.",
      },
      {
        question: "Um indicador claro de falso profeta é:",
        options: [
          "Ter um ministério pequeno",
          "Não realizar milagres",
          "Enriquecer às custas dos fiéis e contradizer as Escrituras",
          "Pregar em igrejas tradicionais",
        ],
        correctIndex: 2,
        explanation: "Enriquecimento pessoal, contradição das Escrituras, manipulação emocional e autoritarismo são marcas clássicas de falsos profetas — ontem e hoje.",
      },
    ],
    conclusion: "Parabéns! Você completou o ciclo inicial do SENTINELA. Agora você possui ferramentas bíblicas para identificar heresias, distorções e falsos profetas. Continue vigilante!",
  },
];
