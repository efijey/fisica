# Física — Explicadora de Fenômenos

Explicadora de física para estudantes: o foco é o *porquê* da fórmula, não o número. Há também um ingestor interno que cataloga exercícios e alimenta o app.

## Funcionalidades

- **Inferência de fórmulas** — selecione grandezas conhecidas e veja quais expressões isolam o que falta
- **Catálogo navegável** — fórmulas por área, com variáveis, fenômenos e gráficos
- **Problemas conceituais** — resposta em palavras (certo / no caminho / desviado)
- **Treino personalizado** — exercício gerado num mundo que você conhece (TFT, LoL), ancorado num trecho de livro citado
- **Ingestor** — listas em texto/PDF, rascunhos de catálogo, export para a explicadora

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, shadcn/ui, Vitest, Supabase.

## Pré-requisitos

- Node.js 20+
- npm

## Setup

```bash
git clone https://github.com/efijey/fisica.git
cd fisica
./init.sh          # npm install se faltar + testes
npm run dev        # explicadora em http://localhost:3000
```

Ingestor: copie `apps/ingestor/.env.example` → `.env.local` e veja [docs/ingestor.md](docs/ingestor.md).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `./init.sh` | Baseline do harness (deps + testes) |
| `npm run dev` | Explicadora (porta 3000) |
| `npm run dev:ingestor` | Ingestor (porta 3001) |
| `npm run build` | Build da explicadora |
| `npm run lint` | ESLint da explicadora |
| `npm test` | Testes do physics-core e do ingestor |
| `npm run export-catalog` | Exporta aprovados do Supabase para o código |

## Estrutura do projeto

```
fisica/
├── AGENTS.md                    # Mapa do agente (não o manual)
├── init.sh                      # Install + verificação
├── harness/                     # Estado da sessão (feature list, progresso)
├── apps/explicadora/            # App do estudante
├── apps/ingestor/               # App interno de exercícios
├── packages/physics-core/       # Catálogos + motor
├── supabase/migrations/         # Schema
└── docs/                        # Visão e docs de tópico
```

## Como funciona

1. O estudante seleciona as variáveis que possui (ex.: velocidade inicial, tempo, aceleração)
2. O motor `inferirFormulas()` percorre o catálogo e encontra fórmulas onde **falta exatamente uma variável**
3. Para cada match, exibe a expressão já isolada na variável desconhecida

## Documentação

- [Manual do sistema](docs/manual.md) — pastas, rotas, lógica e banco, para explicar o projeto
- [Índice dos docs](docs/README.md)
- [Roadmap](docs/roadmap.md)
- [Personalização por mundo](docs/personalizacao.md)
- [Fontes científicas](docs/fontes-cientificas.md)
- [Como o agente trabalha](docs/harness.md)
- [Padrões de Git](docs/git-workflow.md)

## Contribuindo

1. Leia os [padrões de Git](docs/git-workflow.md)
2. Crie `feature/*` a partir da branch ativa
3. Siga [Conventional Commits](https://www.conventionalcommits.org/) em português

## Licença

MIT — veja [LICENSE](LICENSE) para detalhes.
