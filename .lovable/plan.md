# EXAMINAI – Treinador Diário de Discernimento Bíblico

*"Examinai tudo. Retende o bem."*

## Visão Geral

App de treino diário de 15 minutos que desenvolve discernimento bíblico através de módulos progressivos, feedback imediato e chat com IA para análise de ensinos.

---

## 1. Design e Identidade Visual

- Tema escuro (fundo preto/azul profundo) com acentos dourados
- Tipografia elegante e forte transmitindo autoridade bíblica
- Interface minimalista, limpa e sem distrações
- Barras de progresso douradas e ícones de cadeado estilizados

## 2. Autenticação e Perfil

- Login com email/senha, cadastro e recuperação de senha
- Armazenamento do progresso, nível e sequência do usuário
- Tela de perfil com nome, email, preferência de notificações e horário de lembrete

## 3. Onboarding Inicial

- 3 perguntas rápidas sobre a experiência do usuário com discernimento bíblico
- Mensagem final motivacional: "Seu treino diário será de apenas 15 minutos. Consistência gera discernimento."
- Salvar respostas no perfil do usuário

## 4. Dashboard Principal

- Saudação personalizada com nome do usuário
- Botão destaque: "Iniciar Treino de Hoje"
- Progresso geral em porcentagem
- Lista visual dos 7 módulos (desbloqueados vs. com cadeado)
- Contador regressivo de 24h para o próximo módulo
- Mensagem nos módulos bloqueados: "O crescimento acontece na constância."

## 5. Módulo Diário (5 Etapas)

Cada módulo segue a mesma estrutura interativa:

1. **Situação Moderna** – Cenário atual com pregação/ensino potencialmente distorcido
2. **Texto Bíblico + Contexto** – Passagem completa com explicação histórica
3. **Comparação Guiada** – Interpretação correta vs. distorção comum
4. **Mini Teste** – 3 perguntas de múltipla escolha com feedback imediato explicativo
5. **Conclusão** – Mensagem motivacional ("Hoje você fortaleceu seu filtro espiritual")

### Conteúdo dos 7 Primeiros Módulos:

- Dia 1: O que é discernimento bíblico
- Dia 2: Emoção vs Verdade
- Dia 3: Texto fora de contexto
- Dia 4: Prosperidade distorcida
- Dia 5: Revelações modernas
- Dia 6: Cultura vs Escritura
- Dia 7: Como testar qualquer ensino em 3 perguntas

## 6. Sistema de Bloqueio Progressivo

- Apenas 1 módulo disponível por dia
- Próximo módulo libera 24h após conclusão do anterior
- Cadeado visual nos módulos futuros com contador regressivo
- Regra aplicada no backend para evitar burlar o sistema

## 7. Chat IA – "Testar um Ensino"

- O usuário digita uma frase, ensino ou dúvida
- A IA responde com: análise bíblica, possível distorção, versículos relacionados e orientação
- Respostas claras, didáticas e fundamentadas nas Escrituras
- Streaming de resposta em tempo real usando Lovable AI

## 8. Meu Plano (Progresso)

- Dias concluídos e sequência de consistência (streak)
- Nível atual: Iniciante → Em Formação → Discernindo com Clareza
- Barra de progresso geral visual

## 9. Backend (Lovable Cloud)

- **Banco de dados**: Tabelas para perfis, progresso dos módulos, respostas do onboarding, histórico do chat
- **Autenticação**: Email/senha com Supabase Auth
- **Edge Function**: Chat IA com Lovable AI (Gemini) para análise de ensinos bíblicos
- **Lógica de bloqueio**: Controle de liberação de módulos com timestamps no banco

## 10. Estrutura de Navegação

- `/login` e `/cadastro` – Autenticação
- `/onboarding` – Perguntas iniciais
- `/dashboard` – Tela principal
- `/modulo/:dia` – Módulo diário com as 5 etapas
- `/chat-ia` – Testar um Ensino
- `/meu-plano` – Progresso e nível
- `/perfil` – Configurações do usuário
    
  11. Design e Experiência
  - Visual moderno e minimalista
  - Fundo escuro (preto ou azul profundo)
  - Elementos em dourado
  - Tipografia elegante e forte
  - Interface limpa, sem distrações
  - Barra de progresso visível
  - Sensação de autoridade e seriedade bíblica
  Experiência do Usuário:
  O app deve incentivar disciplina diária.
  O usuário nunca pode acessar mais de um módulo por dia.
  O foco é criar hábito e constância.
  Primeiros 7 Módulos:
  Dia 1 – O que é discernimento bíblico
  Dia 2 – Emoção vs Verdade
  Dia 3 – Texto fora de contexto
  Dia 4 – Prosperidade distorcida
  Dia 5 – Revelações modernas
  Dia 6 – Cultura vs Escritura
  Dia 7 – Como testar qualquer ensino em 3 perguntas
  Mensagem central do aplicativo:
  "Examinai tudo. Retende o bem."
  O aplicativo deve ser simples, rápido, inteligente e focado em treino diário de 15 minutos.