# Física — Motor de Fórmulas

Calculadora inteligente de física para estudantes. Selecione as grandezas que você já conhece em um problema e o sistema sugere quais fórmulas podem ser usadas para descobrir a variável que falta — já na forma isolada.

## Funcionalidades

- **Inferência de fórmulas** — selecione variáveis conhecidas e veja quais expressões resolvem o que falta
- **Catálogo navegável** — ~28 fórmulas organizadas por área (cinemática, dinâmica, energia, momento, rotação, gravitação)
- **~55 variáveis físicas** — com símbolo, nome e unidade
- **Interface responsiva** — abas Calculadora e Catálogo, construída com shadcn/ui

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript 5 |
| Estilo | Tailwind CSS 4, shadcn/ui |
| Ícones | Lucide React |

## Pré-requisitos

- Node.js 20+
- npm

## Setup

```bash
git clone https://github.com/efijey/fisica.git
cd fisica
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | Verificação ESLint |
| `npm run test` | Testes unitários (Vitest) |

## Estrutura do projeto

```
fisica/
├── app/
│   ├── page.tsx                 # Entrada da aplicação
│   ├── pages/Calculadora/       # UI principal
│   └── physics/
│       ├── engine/              # Motor de inferência
│       ├── formulas/            # Catálogo de fórmulas
│       └── variables/           # Catálogo de variáveis
├── components/
│   ├── physics/                 # Componentes de domínio
│   └── ui/                      # Componentes shadcn
├── docs/
│   ├── git-workflow.md          # Padrões de branch e commit
│   └── roadmap.md               # Visão e roadmap do projeto
```

## Como funciona

1. O estudante seleciona as variáveis que possui (ex.: velocidade inicial, tempo, aceleração)
2. O motor `inferirFormulas()` percorre o catálogo e encontra fórmulas onde **falta exatamente uma variável**
3. Para cada match, exibe a expressão já isolada na variável desconhecida

## Documentação

- [Padrões de Git e commits](docs/git-workflow.md)
- [Roadmap e backlog](docs/roadmap.md)

## Contribuindo

1. Leia os [padrões de Git](docs/git-workflow.md)
2. Trabalhe na branch `sprint-1` (ou crie `feature/*` a partir dela)
3. Siga [Conventional Commits](https://www.conventionalcommits.org/) em português

## Licença

MIT — veja [LICENSE](LICENSE) para detalhes.
