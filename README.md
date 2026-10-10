# Física — Explicadora de Fenômenos

App educacional para estudantes brasileiros: ajuda a entender **por que** cada fórmula se aplica, como as grandezas se relacionam e em quais fenômenos da natureza elas aparecem — não só a fazer a conta.

> **Manual do sistema** (organização, pastas, rotas, banco): [`docs/manual.md`](docs/manual.md)  
> Contexto vivo / prioridades da sprint: [`docs/mente.md`](docs/mente.md)

## O que tem hoje

- **Inferência de fórmulas** — selecione grandezas conhecidas; o motor sugere expressões onde falta exatamente uma variável
- **Explorar / Catálogo / Gráficos** — ~28 fórmulas, ~55 variáveis, fenômenos e conexões
- **Problemas** — treino conceitual + folha de cálculo mental (voz; LLM OpenAI opcional com fallback mock)
- **Ingestor** (interno) — cola exercícios, cataloga no Supabase e exporta exemplos aprovados

## Stack

| Camada | Tecnologia |
|--------|------------|
| Monorepo | npm workspaces |
| Apps | Next.js 16, React 19, TypeScript 5 |
| UI | Tailwind CSS 4, shadcn/ui |
| Domínio | `@fisica/physics-core` |
| Dados (ingestor) | Supabase |
| LLM (opcional) | OpenAI (`OPENAI_API_KEY`) |
| Testes | Vitest |

## Pré-requisitos

- Node.js 20+
- npm

## Setup

```bash
git clone https://github.com/efijey/fisica.git
cd fisica
npm install
```

### Explicadora (app do estudante)

```bash
# Opcional: LLM real na mesa mental
cp apps/explicadora/.env.example apps/explicadora/.env.local
# edite OPENAI_API_KEY se quiser

npm run dev:explicadora
```

Abra [http://localhost:3000](http://localhost:3000).

### Ingestor (ferramenta interna)

Ver [`docs/ingestor.md`](docs/ingestor.md).

```bash
cp apps/ingestor/.env.example apps/ingestor/.env.local
# preencha Supabase; INGESTOR_SKIP_AUTH=true só em local

npm run dev:ingestor
```

Abra [http://localhost:3001](http://localhost:3001).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` / `dev:explicadora` | Explicadora na porta 3000 |
| `npm run dev:ingestor` | Ingestor na porta 3001 |
| `npm run build` | Build de produção da explicadora |
| `npm run lint` | ESLint da explicadora |
| `npm run test` | Testes (physics-core + parser) |
| `npm run export-catalog` | Exporta exercícios aprovados → explicadora |

## Estrutura

```
fisica/
├── apps/
│   ├── explicadora/     # Produto público (estudante)
│   └── ingestor/        # Catálogo de exercícios (interno)
├── packages/
│   └── physics-core/    # Fórmulas, variáveis, fenômenos, engine
├── supabase/            # Migrations
└── docs/
    ├── manual.md        # Mapa do sistema (consultar sempre)
    ├── mente.md         # Contexto vivo (visão, estado, regras)
    ├── roadmap.md       # Planejamento por sprints
    ├── git-workflow.md  # Branches, commits, revert
    ├── mvp-producao.md  # Checklist para colocar no ar
    └── ingestor.md      # Setup do alimentador
```

## Como funciona (inferência)

1. O estudante seleciona as variáveis que possui
2. `inferirFormulas()` encontra fórmulas em que **falta exatamente uma variável**
3. A UI mostra a expressão isolada + contexto explicativo

## Documentação

| Doc | Para quê |
|-----|----------|
| [Manual do sistema](docs/manual.md) | Mapa estável: pastas, rotas, lógica, banco — por onde procurar |
| [Mente do projeto](docs/mente.md) | Visão, estado real, prioridades da sprint |
| [Roadmap](docs/roadmap.md) | Sprints e backlog |
| [Git](docs/git-workflow.md) | Branches, commits, como reverter |
| [MVP produção](docs/mvp-producao.md) | Checklist de deploy / demo |
| [Ingestor](docs/ingestor.md) | Supabase e export |

## Contribuindo

1. Leia a [mente](docs/mente.md) e o [git-workflow](docs/git-workflow.md)
2. Trabalhe em branch a partir da sprint ativa (próxima: `sprint-4` a partir de `main`)
3. Commits pequenos ([Conventional Commits](https://www.conventionalcommits.org/) em português) + push + PR
4. Mudanças de visão → atualize `docs/mente.md`

## Licença

MIT — veja [LICENSE](LICENSE).
