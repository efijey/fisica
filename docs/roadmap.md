# Roadmap — Física: Explicadora de Fenômenos

> Fonte de planejamento. Contexto vivo e estado detalhado: [mente.md](./mente.md).

## Visão

Construir uma **explicadora de física** para estudantes brasileiros (ensino médio e início do ensino superior). O app não se apoia só na aritmética — o foco é o **porquê**: por que usar determinada fórmula, como as grandezas se relacionam e o que isso representa na natureza.

O estudante deve sair com **compreensão**, não apenas com um resultado.

## Problema

Ao resolver exercícios de física, estudantes frequentemente:

- Não sabem **por que** uma fórmula se aplica ao cenário do enunciado
- Veem equações como receitas, sem entender a relação entre as grandezas
- Não percebem que a mesma variável (ex.: aceleração) aparece em vários fenômenos
- Perdem a conexão entre o exercício e o mundo real

## Solução atual

1. **Inferência** — seleciona variáveis conhecidas; o motor sugere fórmulas em que falta exatamente uma variável (expressão isolada + contexto).
2. **Explorar / Catálogo / Gráficos** — catálogo vivo com metadados, fenômenos e visualizações.
3. **Problemas** — treino conceitual com juiz de raciocínio; folha de cálculo mental (voz + LLM opcional / mock).
4. **Ingestor** (interno) — cola enunciados, cataloga por regras no Supabase, exporta exemplos aprovados.

## Solução futura (médio prazo)

Campo de input onde o estudante cola um exercício. O app identifica entidades e sugere contexto físico e conexões do catálogo — antes do cálculo. Cadeias de inferência multi-etapa e avaliação numérica entram depois do MVP de apresentação.

## Arquitetura

```
apps/explicadora/          → produto do estudante
apps/ingestor/             → ferramenta interna
packages/physics-core/     → catálogos + engine + gráficos
supabase/migrations/       → schema de exercícios
```

Detalhes e fluxo de dados: [mente.md](./mente.md). Setup do ingestor: [ingestor.md](./ingestor.md).

## Estado do produto (pós sprint 3)

| Pronto | Pendente / próximo |
|--------|---------------------|
| Monorepo explicadora + ingestor + physics-core | Deploy público da explicadora |
| ~28 fórmulas, ~55 variáveis, fenômenos, metadados | CI (lint + test + build) |
| Motor `inferirFormulas` + testes | Auth admin real no ingestor |
| Grafo de conexões + Explorar | Explicadora consumindo `catalogoExemplos` |
| Gráficos de equações | Cadeias de inferência multi-etapa |
| Aba Problemas + mesa mental + LLM/mock | Input de enunciado no app do estudante |
| Parser por regras + export-catalog | Cálculo numérico com unidades |
| Schema Supabase + RLS | Polish de demo / roteiro de apresentação |

## Roadmap por fases

### Sprint 1 — Fundação — Concluída

Documentação, GitHub, metadata PT, bug do catálogo, testes do motor, limpeza, MIT.

### Sprint 2 — Profundidade do catálogo — Concluída

Metadados, grafo, explorar variável, fenômenos, testes. Sem cálculo numérico nesta fase.

### Sprint 3 — Ingestor + Problemas — Concluída (com ressalvas)

| Entrega | Status |
|---------|--------|
| Monorepo | Concluído |
| Schema Supabase + migrations | Concluído |
| Parser por regras + UI + export | Concluído |
| Testes do parser | Concluído |
| Aba Problemas + folha mental + LLM/mock | Concluído |
| Gráficos na explicadora | Concluído |
| Auth Supabase (login admin) | Pendente |
| Explicadora consumindo `catalogoExemplos` | Pendente |

### Sprint 4 — MVP no ar (planejada)

**Objetivo:** URL pública estável para apresentar o produto (demo para professora / stakeholders).

Ver checklist em [mvp-producao.md](./mvp-producao.md).

| Entrega | Status |
|---------|--------|
| Branch `sprint-4` a partir de `main` | A iniciar |
| Deploy da explicadora (Vercel ou similar) | Pendente |
| CI mínimo (lint + test + build) | Pendente |
| Demo usável sem OpenAI | Em grande parte pronto (mock) |
| Atualizar docs com URL e roteiro | Pendente |
| Alinhar issues GitHub com este roadmap | Pendente |

**Fora do escopo sugerido da sprint 4:** expandir áreas da física, PWA, histórico localStorage, cálculo numérico completo.

### Backlog futuro

**Cálculo e qualidade**
- Entrada de valores nas variáveis selecionadas
- Avaliação numérica da expressão isolada
- Validação de unidades
- Testes E2E (Playwright)
- Acessibilidade e polish de UI

**Produto**
- Cadeias de inferência multi-etapa
- Input de enunciado com identificação de contexto
- Ligar `catalogoExemplos` à UI do estudante
- Expandir catálogo (termodinâmica, ondas, eletromagnetismo)
- Histórico de problemas (localStorage)
- PWA básico (opcional)

## Áreas de física cobertas

| Área | Exemplos |
|------|----------|
| Cinemática | Velocidade média, MRU, MRUV, lançamento |
| Dinâmica | 2ª lei de Newton, peso, atrito |
| Energia | Trabalho, cinética, potencial gravitacional |
| Momento | Quantidade de movimento, impulso |
| Rotação | Velocidade angular, torque |
| Gravitação | Lei da gravitação universal |

## Como contribuir

1. Leia [mente.md](./mente.md) e [git-workflow.md](./git-workflow.md)
2. Crie branch a partir da sprint ativa (ou `main` se for abrir `sprint-4`)
3. Commits pequenos (Conventional Commits em português) + push + PR
4. Ao final da sprint, PR `sprint-N` → `main`
