# Mente do projeto — Física Explicadora

Documento vivo de contexto. Agentes e humanos devem ler isto **antes** de propor mudanças.
Atualize este arquivo quando a visão, o estado ou o fluxo de trabalho mudarem.

Última sincronização: 2026-10-10 (auditoria pré–sprint de MVP / apresentação).

---

## Em uma frase

App educacional que ajuda estudantes brasileiros a **entender o porquê** das fórmulas de física — não só a fazer a conta.

## Público e objetivo próximo

| Item | Valor |
|------|--------|
| Público | Ensino médio e início do ensino superior |
| Idioma | Português (Brasil) |
| Meta imediata | MVP apresentável em site (ex.: professora / demo) |
| Produto público | `apps/explicadora` |
| Ferramenta interna | `apps/ingestor` (não precisa ir pro ar no MVP demo) |

O dono do projeto está aprendendo boas práticas: preferir explicações claras, mudanças pequenas, branches e commits fáceis de reverter.

---

## O que o sistema é (e o que não é)

**É**
- Explicadora de fenômenos e relações entre grandezas
- Catálogo vivo: fórmulas ↔ variáveis ↔ fenômenos
- Treino conceitual (explicar raciocínio sem necessariamente calcular)
- Mesa de cálculo mental / voz (com LLM opcional)

**Não é (ainda)**
- Calculadora numérica completa de vestibular
- Plataforma com login de alunos
- Substituta de professor — é apoio de compreensão

---

## Arquitetura atual (monorepo)

```
fisica/
├── apps/
│   ├── explicadora/     # App do estudante (Next.js, porta 3000)
│   └── ingestor/        # App interno: cola exercício → cataloga → exporta
├── packages/
│   └── physics-core/    # Catálogos + motor de inferência + conexões + gráficos
├── supabase/
│   └── migrations/      # Schema de exercícios (ingestor)
└── docs/                # Roadmap, git, mente, ingestor
```

| Pacote | Responsabilidade |
|--------|------------------|
| `@fisica/physics-core` | Dados e lógica de domínio (formulas, variáveis, fenômenos, `inferirFormulas`, grafo, gráficos) |
| `@fisica/explicadora` | UI pública: Inferência, Explorar, Catálogo, Gráficos, Problemas |
| `@fisica/ingestor` | CRUD de exercícios + parser por regras + export para catálogo da explicadora |

### Abas da explicadora

1. **Inferência** — seleciona variáveis conhecidas → fórmulas onde falta exatamente 1 variável
2. **Explorar grandezas** — conexões variável ↔ fórmula ↔ fenômeno
3. **Catálogo de fórmulas** — navegação por área
4. **Gráficos** — visualizações de equações do catálogo
5. **Problemas** — treino conceitual + folha de cálculo mental (voz / LLM / mock)

### Fluxo do ingestor

```
colar enunciado → parser por regras → rascunho no Supabase
→ revisar / aprovar → npm run export-catalog
→ apps/explicadora/app/physics/examples/catalog.ts
```

`catalogoExemplos` ainda está vazio até haver exercícios aprovados exportados.
A aba Problemas usa `catalogoProblemas` (estático), não o export do ingestor.

---

## Números do catálogo (ordem de grandeza)

| Recurso | Quantidade aprox. |
|---------|-------------------|
| Fórmulas | ~28 (6 áreas: cinemática, dinâmica, energia, momento, rotação, gravitação) |
| Variáveis | ~55 |
| Fenômenos | ~12 |
| Problemas conceituais | ~10 (cinemática / dinâmica) |

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Monorepo | npm workspaces |
| Apps | Next.js 16 (App Router), React 19, TypeScript 5 |
| UI | Tailwind CSS 4, shadcn/ui |
| Domínio | `packages/physics-core` |
| Dados (interno) | Supabase (Postgres + RLS) |
| LLM (opcional) | OpenAI via Vercel AI SDK (`OPENAI_API_KEY`) |
| Testes | Vitest (physics-core + parser do ingestor) |

### Variáveis de ambiente

- Explicadora: `apps/explicadora/.env.example` → `OPENAI_API_KEY` (sem ela, modo mock)
- Ingestor: `apps/ingestor/.env.example` → URL/keys Supabase; `INGESTOR_SKIP_AUTH=true` só em local

Nunca commitar `.env.local` nem secrets.

---

## Histórico de sprints (o que já foi feito)

### Sprint 1 — Fundação
Documentação inicial, GitHub, metadata PT, bug do catálogo, testes do motor, limpeza de types, MIT.

### Sprint 2 — Profundidade do catálogo
Metadados explicativos, grafo de conexões, explorar por variável, fenômenos, testes do grafo.
Repos numérica / cálculo numérico ficaram de fora (ainda no backlog).

### Sprint 3 — Ingestor + Problemas
- Monorepo (`explicadora`, `ingestor`, `physics-core`)
- Schema Supabase + parser por regras + UI de aprovação + `export-catalog`
- Aba **Problemas** com juiz conceitual, folha de cálculo mental, Web Speech, LLM OpenAI com fallback mock
- Gráficos na explicadora

Pendências da sprint 3 ainda abertas:
- Auth admin real no ingestor (hoje dá para pular com `INGESTOR_SKIP_AUTH`)
- Explicadora consumindo `catalogoExemplos` do export

### Issues antigas no GitHub (podem estar defasadas)
Issues #1–#5 ainda abertas falam em “Sprint 2/4” com escopos antigos (valores numéricos, CI, deploy). Tratar o **roadmap + esta mente** como fonte da verdade; alinhar issues quando a próxima sprint for aberta.

---

## Direção: MVP em produção (próxima onda)

Objetivo: site público estável para **apresentar a ideia**, não plataforma completa.

Prioridade sugerida (ajustável na sprint):

1. **Deploy da explicadora** (Vercel ou similar) com build verde
2. **CI** mínimo: lint + test + build
3. **Polish de demo** — o que a professora vê em 5 minutos (Problemas + Inferência + Explorar)
4. Secrets só no host (OpenAI opcional; demo deve funcionar sem chave, via mock)
5. Ingestor: opcional offline / local; não bloqueia a demo pública
6. Documentar URL, pitch e roteiro de apresentação (quando o deploy existir)

Detalhes operacionais: [mvp-producao.md](./mvp-producao.md).

---

## Como trabalhamos (iterável e reversível)

Princípios (sempre):

1. **Branch por mudança** — nunca trabalhar direto em `main`
2. **Sprint ativa** como base — hoje o histórico está em `sprint-3` / `main` (já mergeado); próxima sprint = `sprint-4` a partir de `main`
3. **Commits pequenos** — Conventional Commits em português; uma ideia por commit
4. **Push + PR** — GitHub é a memória de versões; fácil reverter ou fechar PR
5. **Atualizar a mente** — se a conversa mudar visão, arquitetura ou prioridades, editar este arquivo na mesma PR (ou PR de docs logo em seguida)

Fluxo detalhado: [git-workflow.md](./git-workflow.md).

---

## Regras para agentes (resumo)

1. Ler `docs/mente.md` + `docs/roadmap.md` no início de tarefas relevantes
2. Preferir mudanças pequenas e reversíveis
3. Não expandir escopo “porque seria legal” — alinhar com MVP / pedido do usuário
4. Next.js deste repo pode diferir do treino: consultar `node_modules/next/dist/docs/`
5. Explicar decisões em português claro; o usuário não é expert em engenharia
6. Seguir `.cursor/rules/` (contexto do projeto + git iterativo)

---

## Comandos do dia a dia

```bash
npm install
npm run dev:explicadora   # :3000
npm run dev:ingestor      # :3001
npm test
npm run lint
npm run build             # build da explicadora
npm run export-catalog    # após aprovar exercícios no ingestor
```

---

## Onde olhar no código

| Assunto | Caminho |
|---------|---------|
| UI principal | `apps/explicadora/app/pages/Calculadora/index.tsx` |
| Motor de inferência | `packages/physics-core/src/physics/engine/inferencia.ts` |
| Catálogos de domínio | `packages/physics-core/src/physics/` |
| Problemas + juiz | `apps/explicadora/app/physics/problemas/` |
| Mesa mental / LLM | `apps/explicadora/app/physics/problemas/mental/` + `app/api/mental/turno` |
| Parser ingestor | `apps/ingestor/lib/parser/analisar.ts` |
| Migration Supabase | `supabase/migrations/` |
