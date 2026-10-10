# Roadmap — Física: Explicadora de Fenômenos

Status operacional das features (o que está `passing` / `in_progress`): [`harness/feature_list.json`](../harness/feature_list.json). Este arquivo é visão de produto e histórico de fases — não é o tracker da sessão.

Como o agente trabalha: [`docs/harness.md`](./harness.md) e [`AGENTS.md`](../AGENTS.md).

## Visão

Construir uma **explicadora de física** para estudantes brasileiros (ensino médio e início do ensino superior). O app não se apoia na aritmética nem no cálculo numérico — o foco é o **porquê**: por que usar determinada fórmula, como as grandezas físicas se relacionam e o que isso representa na natureza.

O estudante deve sair com **compreensão**, não apenas com um resultado. A aplicação funciona como um catálogo vivo que conecta matemática e fenômenos reais: em quantas equações a aceleração aparece, em quais contextos ela surge (frear um carro, queda livre, curva em estrada) e por que é central na mecânica.

## Problema

Ao resolver exercícios de física, estudantes frequentemente:

- Não sabem **por que** uma fórmula se aplica ao cenário do enunciado
- Veem equações como receitas, sem entender a relação entre as grandezas
- Não percebem que a mesma variável (ex.: aceleração) aparece em vários fenômenos e áreas
- Perdem a conexão entre o exercício de vestibular e o que acontece no mundo real

## Solução atual

O usuário **seleciona as variáveis conhecidas** em um problema. O motor de inferência percorre o catálogo de fórmulas e identifica aquelas em que **falta exatamente uma variável**, sugerindo a expressão isolada para a grandeza que falta — com contexto descritivo.

Além disso, há um **catálogo navegável** de fórmulas organizadas por área da física.

## Solução futura (visão de médio prazo)

Campo de input onde o estudante cola ou digita um exercício de vestibular. O app identifica entidades no texto (carro, planeta, mola, projétil) e, pela base de fenômenos, sugere o contexto físico provável (ex.: carro → mecânica, aceleração, atrito) e as conexões relevantes do catálogo — antes mesmo de chegar ao cálculo.

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

### Fluxo de dados

```
Usuário seleciona variáveis
        ↓
inferirFormulas(variaveisDisponiveis)
        ↓
Para cada fórmula: faltando.length === 1?
        ↓ sim
Retorna expressão isolada + variável calculável + contexto explicativo
        ↓
ListaFormulas exibe resultados agrupados por área
```

## Estado do MVP

| Pronto | Pendente |
|--------|----------|
| Catálogo de ~27 fórmulas em 6 áreas | Cadeias de inferência (várias etapas) |
| Catálogo de ~55 variáveis físicas | Input de enunciado com identificação de contexto |
| Motor de inferência (falta 1 variável) | Testes E2E |
| UI responsiva com shadcn/ui | Deploy em produção |
| Abas Inferência + Explorar + Catálogo | Passo a passo explicativo da resolução |
| Separação engine / UI / dados | |
| Testes unitários do motor de inferência | |
| Metadados explicativos (variáveis, fórmulas, fenômenos) | |
| Grafo de conexões variável ↔ fórmula | |
| Vista de exploração por variável | |
| Testes do grafo de conexões | |

## Roadmap por fases

### Sprint 1 — Fundação

**Objetivo:** organizar o projeto, versionar o código, corrigir pendências básicas e estabelecer qualidade mínima.

| Entrega | Status |
|---------|--------|
| Documentação (README, git-workflow, roadmap) | Concluído |
| Repositório GitHub + branch `sprint-1` | Concluído |
| Metadata em português (`layout.tsx`) | Concluído |
| Corrigir bug `expressao` → `expressaoPrincipal` no catálogo | Concluído |
| Testes unitários do motor `inferirFormulas()` | Concluído |
| Remover `types/independentes/` (substituído pelo catálogo) | Concluído |
| Adicionar licença MIT | Concluído |
| Issues no GitHub para próximas sprints | Concluído |

### Sprint 2 — Profundidade do catálogo

**Objetivo:** enriquecer a qualidade e a densidade de informações do catálogo — conexões entre natureza e matemática, não expansão em quantidade de fórmulas.

Foco em responder perguntas como: *"Em quantas equações a aceleração aparece? Por quê ela é tão presente? Em quais fenômenos da natureza ela surge?"*

| Entrega | Status |
|---------|--------|
| Metadados explicativos nas variáveis | Concluído |
| Metadados explicativos nas fórmulas | Concluído |
| Grafo de conexões variável ↔ fórmula | Concluído |
| Vista de exploração por variável | Concluído |
| Fenômenos / contextos no catálogo | Concluído |
| Testes para o grafo de conexões | Concluído |

**Fora do escopo desta sprint:** novas fórmulas, cálculo numérico, input de enunciado.

### Sprint 3 — Ingestor de exercícios

**Objetivo:** app interno que ingere exercícios em texto, cataloga fórmulas/variáveis/fenômenos via regras, armazena no Supabase e exporta exemplos aprovados para a explicadora.

| Entrega | Status |
|---------|--------|
| Monorepo (`apps/explicadora`, `apps/ingestor`, `packages/physics-core`) | Concluído |
| Schema Supabase + migrations | Concluído |
| Parser por regras (opção A) | Concluído |
| UI ingestor (colar, listar, aprovar/rejeitar) | Concluído |
| Script `export-catalog` | Concluído |
| Testes do parser | Concluído |
| Auth Supabase (login admin) | Pendente |
| Explicadora consumindo `catalogoExemplos` | Pendente |
| Listas texto/PDF + split | Concluído |
| Pré-resolução LLM + propostas de catálogo | Concluído |
| UI `/catalogo/rascunhos` | Concluído |
| Export → problemas + `physics-core/generated` | Concluído |
| Explicadora consumindo problemas gerados | Concluído |

Ver [ingestor.md](./ingestor.md) para setup.

### Backlog futuro

**Cálculo e qualidade**
- Campos de entrada para valores das variáveis selecionadas
- Avaliação numérica da expressão isolada
- Validação de unidades compatíveis
- Testes E2E (Playwright)
- CI com lint + build + testes
- Deploy (Vercel ou similar)
- Polish de UI e acessibilidade

**Outros**
- Expandir catálogo (termodinâmica, ondas, eletromagnetismo)
- Histórico de problemas explorados (localStorage)
- PWA básico (opcional)

## Áreas de física cobertas

| Área | Exemplos de fórmulas |
|------|---------------------|
| Cinemática | Velocidade média, MRU, MRUV, lançamento |
| Dinâmica | 2ª lei de Newton, peso, atrito |
| Energia | Trabalho, energia cinética, potencial gravitacional |
| Momento | Quantidade de movimento, impulso |
| Rotação | Velocidade angular, torque |
| Gravitação | Lei da gravitação universal |

## Como contribuir

1. Leia [git-workflow.md](./git-workflow.md) para padrões de branch e commit
2. Trabalhe na branch `sprint-3` (ou crie `feature/*` a partir dela)
3. Abra PR para `sprint-3` ao concluir uma feature
4. Ao final da sprint, PR de `sprint-3` → `main`

Agentes: uma feature por vez, verificação antes de `passing`, commit só se o usuário pedir.
