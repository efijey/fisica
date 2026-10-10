# Personalização por interesses — visão de produto

Documento de **direção** (estável o suficiente para explicar a ideia; detalhe de sprint fica na mente/roadmap).

Ligação pedagógica: exemplos e problemas no **mundo familiar do aluno** reduzem carga cognitiva ao aprender o mesmo conceito científico.

---

## Tese

Hoje muitos exercícios usam cenários genéricos (avião, carro genérico) que o aluno pode não conhecer bem — isso gasta atenção antes mesmo da física.

A proposta: o **esqueleto científico** (fórmula, grandezas, relações) fica estável; a **pele narrativa** (futebol, corrida, LoL, culinária…) vem dos interesses do usuário.

```
esqueleto (physics-core)     +     pele (interesses do usuário)
─────────────────────────────────────────────────────────────
a = Δv / Δt                  →     arrancada do atacante
                                 sprint na lane / pacing na corrida
```

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

### Fase 0 — Paciente zero (sem login)

- Selecionar interesses na explicadora (multi-select)
- Guardar em `localStorage`
- Poucas variantes **manuais** nos mundos do autor (futebol, corrida, TFT, LoL, xadrez, culinária)
- Problemas / exemplos das grandezas respeitam o perfil; fallback neutro se faltar variante
- Objetivo: validar a tese na própria aprendizagem

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

Usar como seed da Fase 0/1:

- Futebol  
- Corrida  
- Team Fight Tactics (TFT)  
- League of Legends  
- Xadrez  
- Culinária  

Não é lista fechada do produto — é o primeiro laboratório.

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
