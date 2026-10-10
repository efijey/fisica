# Roadmap — Física: Explicadora de Fenômenos

Status operacional das features (o que está `passing` / `in_progress`): [`harness/feature_list.json`](../harness/feature_list.json). Este arquivo é visão de produto e histórico de fases — não é o tracker da sessão.

Como o agente trabalha: [`docs/harness.md`](./harness.md) e [`AGENTS.md`](../AGENTS.md). Mapa do sistema para humanos: [`docs/manual.md`](./manual.md).

## Visão

Construir uma **explicadora de física** para estudantes brasileiros. O foco é o **porquê**: por que usar determinada fórmula, como as grandezas físicas se relacionam e o que isso representa na natureza.

O estudante deve sair com **compreensão**, não apenas com um resultado. A aplicação funciona como um catálogo vivo que conecta matemática e fenômenos reais.

### Personalização por mundo (lente)

Exemplos em cenários pouco familiares (avião decolando, por exemplo) gastam atenção antes mesmo da física. A tese do projeto: o **esqueleto científico** (definições, equações, derivações) é fixo; a **pele** (intuições, analogias, exemplos, exercícios) vem de um mundo que o aluno conhece — TFT, League of Legends, futebol, mountain bike.

O mundo funciona como um **idioma do site**: assim como se escolhe ler em português ou inglês, escolhe-se ler na "versão TFT". A parte formal nunca muda; os textos da pele são gerados uma vez por tópico e mundo, revisados e salvos.

Detalhes: [personalizacao.md](./personalizacao.md) e [fontes-cientificas.md](./fontes-cientificas.md).

### Paciente zero

O autor do projeto é estudante de física e vai usar a ferramenta durante o semestre de **Física 1** (cinemática, leis de Newton, trabalho e energia, com cálculo: limites, derivadas e integrais). Referência principal: **Young & Freedman (Sears & Zemansky)**. Validar com ele antes de pensar em outros usuários.

## Problema

Ao resolver exercícios de física, estudantes frequentemente:

- Não sabem **por que** uma fórmula se aplica ao cenário do enunciado
- Veem equações como receitas, sem entender a relação entre as grandezas
- Não percebem que a mesma variável (ex.: aceleração) aparece em vários fenômenos e áreas
- Perdem a conexão entre o exercício e o que acontece no mundo real

## Solução atual

- **Inferência** — seleciona variáveis conhecidas; o motor sugere fórmulas em que falta exatamente uma variável.
- **Explorar / Catálogo / Gráficos** — catálogo navegável com metadados, fenômenos e visualizações.
- **Problemas** — treino conceitual com juiz de raciocínio; folha de cálculo mental com voz.
- **Treino personalizado** — exercício gerado num mundo (TFT/LoL) a partir de um card de literatura, com citação e juiz.
- **Ingestor** (interno) — listas em texto/PDF, rascunhos de catálogo, export para a explicadora.

## Arquitetura

```
apps/explicadora/     → app do estudante (:3000)
apps/ingestor/        → ingestão e aprovação de exercícios (:3001)
packages/physics-core → catálogos + motor de inferência
supabase/migrations/  → schema Postgres
harness/              → estado do agente (feature list, progresso, handoff)
docs/                 → visão, tópicos, git
```

Mapa por app: `docs/explicadora.md`, `docs/ingestor.md`, `docs/physics-core.md`.

## Roadmap por fases

### Sprint 1 — Fundação — Concluída

Documentação, GitHub, metadata em português, bug do catálogo, testes do motor, limpeza de types, licença MIT.

### Sprint 2 — Profundidade do catálogo — Concluída

Metadados explicativos, grafo de conexões variável ↔ fórmula, exploração por variável, fenômenos, testes do grafo.

### Sprint 3 — Ingestor + Problemas — Concluída (com ressalvas)

| Entrega | Status |
|---------|--------|
| Monorepo (`apps/explicadora`, `apps/ingestor`, `packages/physics-core`) | Concluído |
| Schema Supabase + migrations | Concluído |
| Parser por regras + UI de aprovação + `export-catalog` | Concluído |
| Testes do parser | Concluído |
| Aba Problemas + folha mental + LLM/mock | Concluído |
| Gráficos na explicadora | Concluído |
| Listas texto/PDF + split | Concluído |
| Pré-resolução LLM + propostas de catálogo (`/catalogo/rascunhos`) | Concluído |
| Export → problemas + `physics-core/generated` | Concluído |
| Auth Supabase (login admin) | Pendente |

### Sprint 4 — Física 1 com lentes (paciente zero)

**Objetivo:** transformar a explicadora em material de estudo do semestre de Física 1, com versão formal e versões por mundo. Uso local; deploy fica para depois.

| Entrega | Status |
|---------|--------|
| Treino personalizado TFT/LoL + cards de literatura + juiz | Concluído (na branch de consolidação) |
| Consolidar branches e documentação (harness como estrutura) | Em andamento |
| Ementa típica de Física 1 (ajustável pelo autor) | Pendente |
| Renderização de equações (derivadas, integrais) | Pendente |
| Trilha de estudo: primeiro capítulo completo (cinemática 1D com cálculo) | Pendente |
| Lente por mundo no capítulo (pele gerada uma vez, revisada, salva) | Pendente |
| Repetir o formato para os demais capítulos | Pendente |

**Fora do escopo:** login, multiusuário, deploy público, tags criadas pelo usuário.

### Backlog futuro

**Personalização**
- Tags nichadas (texto livre → tag; pool de conteúdo por tag; recomendação entre alunos)
- Auth + interesses + conteúdo no Supabase
- Desenho do tabuleiro/mapa no exercício para reduzir carga cognitiva

**Cálculo e qualidade**
- Avaliação numérica e validação de unidades
- Testes E2E (Playwright)
- CI com lint + build + testes
- Deploy (Vercel ou similar) — checklist em [mvp-producao.md](./mvp-producao.md)

**Outros**
- Expandir catálogo (termodinâmica, ondas, eletromagnetismo)
- PWA básico (opcional)

## Como contribuir

1. Leia [git-workflow.md](./git-workflow.md) para padrões de branch e commit
2. Trabalhe em `feature/*` a partir da branch ativa
3. Commits pequenos são livres na branch; push, merge e PR só com aprovação do autor

Agentes: uma feature por vez, verificação antes de `passing`, decisões apresentadas como perguntas com opções.
