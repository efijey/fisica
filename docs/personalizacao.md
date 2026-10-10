# Personalização por interesses — visão de produto

Documento de **direção** (estável o suficiente para explicar a ideia; detalhe de sprint fica no roadmap e no harness).

Ligação pedagógica: exemplos e problemas no **mundo familiar do aluno** reduzem carga cognitiva ao aprender o mesmo conceito científico.

---

## Tese

Hoje muitos exercícios usam cenários genéricos (avião, carro genérico) que o aluno pode não conhecer bem — isso gasta atenção antes mesmo da física.

A proposta: o **esqueleto científico** (fórmula, grandezas, relações) fica estável; a **pele narrativa** vem dos interesses do usuário — e esses interesses devem poder ser **nichados**, não só categorias largas.

```
esqueleto (physics-core)     +     pele (tags / interesses do usuário)
─────────────────────────────────────────────────────────────
a = Δv / Δt                  →     arrancada do atacante (LoL)
                                 Porsche em pista (não F1)
                                 mountain bike em trilha
```

---

## O mundo como idioma do site (decisão de 2026-10-10)

O mundo escolhido funciona como a troca de idioma de um site: escolhendo "versão TFT", **o site inteiro** passa a falar nessa linguagem, não só um exercício avulso.

| Parte do conteúdo | Muda com o mundo? |
|-------------------|-------------------|
| Definições, equações, derivações com cálculo | Não. É o que o aluno usa na prova |
| Intuição, analogias, exemplos | Sim |
| Exercícios | Sim |
| Citação da fonte (livro) | Não |

Como os textos por mundo nascem:

1. Gerados **uma vez** por tópico e mundo, a partir do texto formal e da fonte citada.
2. O autor revisa.
3. Ficam salvos no repositório (versionados, fáceis de reverter), como as traduções de um site.

Primeiro uso: a trilha de Física 1 (Young & Freedman) do semestre do autor, começando por um capítulo completo antes de escalar.

## Dois tipos de mundo (decisão de 2026-10-10)

| | Mundo de afinidade | Mundo de interesse (aplicação) |
|---|---|---|
| Exemplos | TFT, LoL, futebol, mountain bike | Nanopartículas para biomateriais, medicina, engenharia |
| Objetivo | Baixar carga cognitiva com um cenário conhecido | Ponte da física básica para um tema complexo e interdisciplinar que o aluno quer dominar |
| Fatos do mundo vêm de | Quem conhece o jogo/esporte (curadoria) | Fontes científicas citadas (artigos, livros), como os cards de literatura |
| Risco principal | Inventar mecânica do jogo | Inventar ciência — mais grave, porque o aluno leva a sério |

Regras para mundos de interesse:

- Nível iniciante na **aplicação**, rigor total na **física**: o exercício usa a física do capítulo, e o tema avançado entra como contexto real, não simplificado a ponto de ficar errado.
- Cada fato do mundo tem citação, e a UI mostra a fonte do contexto além da fonte da física.
- Seriedade: nada de "historinha"; o exercício deve deixar o aluno entendendo um pouco mais do tema de interesse.

### Física para jogar melhor (decisão de 2026-10-10)

Um mundo de afinidade não é só cenário: a física pode ser **útil dentro dele**. No TFT, quem entende como as grandezas se relacionam compara itens e campeões melhor e ganha mais partidas. Isso dá ao aluno um motivo concreto para aprender, e mantém o engajamento.

Exemplos com o TFT:

- Velocidade de ataque é uma taxa (ataques por segundo). Dano por segundo = dano por ataque × ataques por segundo.
- Análise dimensional útil: vida ÷ dano por segundo = tempo para derrubar o alvo.
- Aumentos percentuais rendem mais ou menos conforme a base do campeão.
- Itens que aumentam a velocidade de ataque durante o combate funcionam como uma aceleração; o dano total é a área sob a curva (integral, capítulo 2).

Como entra no site: um bloco **"No jogo"** em cada seção da versão do mundo, com uma aplicação real.

Dados do jogo: a base oficial da Riot (Data Dragon) só traz nome, imagem e custo. Os atributos (velocidade de ataque, dano, vida, alcance, efeitos de itens) vêm da **CommunityDragon**, extraída dos arquivos do jogo. Um script salva uma cópia no repositório com set, versão e data; os números são conferidos pelo autor antes de entrar no texto, e a cópia só é atualizada de propósito (a cada set novo).

Primeiro mundo de interesse (paciente zero): **nanopartículas para biomateriais**. Ganchos com Física 1: arrasto viscoso e velocidade terminal (leis de Newton), energia térmica vs. gravitacional (por que não sedimentam), movimento browniano (deslocamento vs. distância), razão área/volume.

---

## Evolução da “ingestora”

A ingestora **não some**. Ela muda de papel ao longo do tempo:

| Fase | Papel | Quem usa |
|------|--------|----------|
| Hoje | Colar enunciado → parser → aprovar → export estático | Autor / equipe |
| Próximo | **Mapeadora de interesses** + estúdio de conteúdo personalizado | Aluno (perfil) + autor (revisão) |
| Depois | Pipeline: interesse → gerar (API) → guardar no banco → servir na explicadora | Plataforma multi-usuário |

Em outras palavras: o que hoje é “alimentar o catálogo global” vira também “alimentar o **treino de cada pessoa**” — e, quando fizer sentido, um **pool compartilhado por interesse**.

---

## Modelo mental (3 peças)

```
┌──────────────────────┐
│ Perfil do usuário    │  interesses: futebol, LoL, corrida…
│ (auth + preferências)│
└──────────┬───────────┘
           │ escolhe / prioriza
┌──────────▼───────────┐
│ Pool de conteúdo     │  problemas / exemplos / narrativas
│ por interesse (+ ids │  sempre amarrados a formulaIds /
│ de física do core)   │  variavelIds / fenomenoIds
└──────────┬───────────┘
           │ lê
┌──────────▼───────────┐
│ Explicadora          │  treino: mostra o que combina
│ (app do estudante)   │  com o perfil (fallback neutro)
└──────────────────────┘
```

**Reaproveitamento:** se Maria e João marcam “futebol”, os dois podem consumir o mesmo item do pool `interesse=futebol` — não é obrigatório gerar tudo do zero por usuário.  
**Personalização forte:** itens gerados sob demanda ficam ligados ao `user_id` *e* aos interesses; depois de revisados, podem subir para o pool do interesse.

---

## O que fica no código vs no banco

| No código (`physics-core`) | No banco (Supabase, evolução) |
|----------------------------|-------------------------------|
| Fórmulas, variáveis, motor | Perfil / interesses do usuário |
| Significado científico estável | Narrativas e problemas personalizados |
| Grafo de conexões | Status: rascunho / aprovado / no pool |
| Testes do esqueleto | Quem gerou, para quais interesses, reuso |

Regra de ouro: **IA e banco não inventam física nova** — só revestem esqueletos já existentes no core.

---

## Papéis possíveis da API

1. **Gerar variante** — dado `(conceito/esqueleto + interesses)` → enunciado + pergunta + rubrica mínima  
2. **Servir treino** — dado `user_id` → lista de problemas/exemplos do pool dos interesses dele  
3. **Promover a pool** — item gerado para um usuário, após revisão, vira conteúdo do interesse (reuso)

A ingestora (UI interna ou aba admin) é o lugar natural para **revisar** o que a API gerou — mesmo espírito do aprovar/rejeitar de hoje.

---

## Fases sugeridas (paciente zero → plataforma)

### Fase 0 — Paciente zero (sem login) — em construção

- Aba **Treino personalizado** na explicadora
- Mundos iniciais: **TFT** e **League of Legends** (fatos curados; sem inventar patch)
- Conceitos ancorados em **cards de literatura** (`literatura/cards.ts`) + citação na UI
- Geração via OpenAI (`OPENAI_API_KEY`) com fallback mock
- Persistência só em `localStorage` (este navegador)
- Como alimentar fontes dos seus PDFs: [`fontes-cientificas.md`](./fontes-cientificas.md)
- Objetivo: validar a tese na própria aprendizagem antes de login/multi-usuário

### Fase 1 — Conta + banco de interesses

- Auth Supabase (login simples)
- Tabelas: `profiles`, `user_interests`, `content_items` (ou evolução do schema de `exercises`)
- Explicadora passa a **puxar** problemas do banco filtrados pelos interesses
- Ingestora vira painel: interesses canônicos + conteúdo do pool

### Fase 2 — Geração sob demanda + reuso

- Botão / job: “gerar para estes interesses”
- API (LLM) preenche pele; item nasce como `rascunho` ligado ao user
- Revisão humana (ou regras) → `aprovado` → disponível no pool do interesse
- Quanto mais gente no mesmo interesse, menos geração repetida

### Fase 3 — Produto de treino

- Histórico do aluno, dificuldade, “já vi este esqueleto em outro mundo”
- Métricas leves: engajamento por interesse (só se couber na pesquisa)
- Deploy público estável da explicadora personalizada

---

## Paciente zero — interesses iniciais (autor)

Usar como seed da Fase 0/1 (mundos largos para validar o pipeline):

- Futebol  
- Corrida *(categoria larga — ver tags abaixo)*  
- Team Fight Tactics (TFT)  
- League of Legends  
- Xadrez  
- Culinária  

Não é lista fechada do produto — é o primeiro laboratório.

---

## Ideia registrada: tags nichadas (estilo “seguir perfil”)

> Anotado para **próximas iterações** — não implementar rede social completa agora.  
> Objetivo: lembrar que “corrida” / “jogos” é só o começo; o valor está no **nicho**.

### Problema com categorias largas

Se o sistema só oferece “corrida”, a pessoa ainda pode ter carga cognitiva (ou desinteresse):

- alguém gosta de **corrida de mountain bike**  
- outra pessoa gosta de **super carros em pista** (Porsche, BMW…) — **sem ser Fórmula 1**  

São mundos mentais diferentes. Forçar um balde único (“corrida”) enfraquece a tese da personalização.

### Tags como unidade de interesse

| Conceito | Exemplo |
|----------|---------|
| Texto livre do usuário | “corrida de porsche em pista”, “mtb downhill” |
| Normalização → **tag** | `corrida-porsche-pista`, `mtb-downhill` |
| Conteúdo linkado à tag | exemplos, problemas, metáforas daquele nicho |
| Perfil do aluno | conjunto de tags que ele “segue” |

Fluxo mental:

```
pessoa escreve interesse
        ↓
sistema mapeia / sugere tags (e pode criar tag nova)
        ↓
feed de treino = conteúdo das tags do perfil
        ↓
outras pessoas podem recomendar tag (“essa é massa, coloca no perfil”)
```

### Analogia com redes sociais (estratégia de produto)

Não é “virar Instagram”. É copiar o mecanismo que **segura atenção** e **afina identidade**:

1. **Seguir tags** ≈ seguir perfis/temas — o que aparece no treino vem do que você segue.  
2. **Nicho > genérico** — quanto mais específico o mundo, menor a carga extra e maior o “isso é pra mim”.  
3. **Descoberta social leve** — comentários / “essa tag é daora” / sugerir tag a um colega (fase bem posterior).  
4. **Tempo na ferramenta** — utilidade pedagógica também depende de a pessoa **querer voltar**; personalização nichada é a alavanca de engajamento alinhada ao aprendizado (não scroll vazio).  
5. **Pool por tag** — conteúdo gerado/revisado para `mtb-downhill` reaproveita para todos que seguem essa tag (mesma lógica de reuso por interesse, só mais fina).

### Implicações técnicas (quando for a hora)

- Tags: slug estável + label legível + opcional hierarquia (`corrida` → `corrida-porsche-pista`)  
- Entrada: campo de texto + autocomplete de tags existentes + “criar tag”  
- Conteúdo: `content_items.tag_ids[]` (ou tabela N:N), sempre com `formulaIds` do core  
- Geração: prompt recebe **fatos/restrições da tag** (não só do mundo largo)  
- Social (depois): follow tag, sugestão entre usuários, comentário opcional — **fora** do paciente zero  

### O que NÃO fazer agora

- Rede social completa, likes, feed infinito  
- Obrigatoriedade de tag perfeita no MVP do autor  
- Substituir os mundos TFT/LoL atuais — eles continuam como primeiras tags/mundos de laboratório  

Quando a Fase 0 agradar: próximo passo natural é **texto livre → tag** no perfil local, ainda sem comunidade.

---

## Relação com o MVP de apresentação

Dá para apresentar a professora em duas camadas:

1. **Demo estável** — explicadora atual (inferência, explorar, problemas neutros) no ar  
2. **Tese de pesquisa** — personalização por interesses (mesmo com Fase 0 em localStorage)

Não é obrigatório ter login multi-usuário para a primeira conversa; mas a **arquitetura** já deve apontar para banco + perfil, para não jogar fora o trabalho da ingestora.

---

## Decisões a tomar na sprint (quando implementar)

1. Fase 0 só na explicadora, ou já esboçar tabelas no Supabase?  
2. Personalizar primeiro **Problemas**, **exemplos das grandezas**, ou os dois?  
3. Geração por LLM na mesma sprint ou só depois do perfil + variantes manuais?  
4. Renomear mentalmente o app `ingestor` (ex.: “estúdio” / “interesses”) só na docs, ou também no código?

Até lá, qualquer implementação deve respeitar: **esqueleto no core · pele por interesse · reuso por pool · revisão antes de virar verdade do produto**.
