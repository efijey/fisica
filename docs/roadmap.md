# Roadmap — Física: Motor de Fórmulas

## Visão

Construir uma **calculadora inteligente de física** para estudantes brasileiros (ensino médio e início do ensino superior). O app ajuda a escolher a fórmula certa a partir das grandezas que o estudante já conhece em um problema, mostrando a expressão já isolada na variável que falta.

## Problema

Ao resolver exercícios de física, estudantes frequentemente:

- Não sabem qual fórmula aplicar dado o que o enunciado fornece
- Têm dificuldade em isolar a variável desconhecida
- Perdem tempo reorganizando equações manualmente

## Solução atual

O usuário **seleciona as variáveis conhecidas** em um problema. O motor de inferência percorre o catálogo de fórmulas e identifica aquelas em que **falta exatamente uma variável**, sugerindo a expressão isolada para calcular o que falta.

Além disso, há um **catálogo navegável** de fórmulas organizadas por área da física.

## Arquitetura

```
app/
├── page.tsx                    → entrada da aplicação
├── pages/Calculadora/          → UI principal (abas Calculadora + Catálogo)
└── physics/
    ├── engine/inferencia.ts    → motor de inferência
    ├── formulas/catalog.ts     → catálogo de fórmulas e variações isoladas
    └── variables/catalog.ts    → catálogo de variáveis físicas

components/
├── physics/                    → SeletorVariavel, ListaFormulas, CatalogoFormulas, Card*
└── ui/                         → componentes shadcn (tabs, card, badge, etc.)
```

### Fluxo de dados

```
Usuário seleciona variáveis
        ↓
inferirFormulas(variaveisDisponiveis)
        ↓
Para cada fórmula: faltando.length === 1?
        ↓ sim
Retorna expressão isolada + variável calculável
        ↓
ListaFormulas exibe resultados agrupados por área
```

## Estado do MVP

| Pronto | Pendente |
|--------|----------|
| Catálogo de ~27 fórmulas em 6 áreas | Entrada de valores numéricos |
| Catálogo de ~55 variáveis físicas | Cálculo automático do resultado |
| Motor de inferência (falta 1 variável) | Cadeias de inferência (várias etapas) |
| UI responsiva com shadcn/ui | Passo a passo da resolução |
| Abas Calculadora + Catálogo | Testes automatizados |
| Separação engine / UI / dados | Deploy em produção |
| | Metadata e i18n completos (pt-BR) |
| | Integração dos tipos em `types/independentes/` |

## Roadmap por fases

### Sprint 1 — Fundação

**Objetivo:** organizar o projeto, versionar o código, corrigir pendências básicas e estabelecer qualidade mínima.

| Entrega | Status |
|---------|--------|
| Documentação (README, git-workflow, roadmap) | Em andamento |
| Repositório GitHub + branch `sprint-1` | Em andamento |
| Metadata em português (`layout.tsx`) | Pendente |
| Corrigir bug `expressao` → `expressaoPrincipal` no catálogo | Pendente |
| Testes unitários do motor `inferirFormulas()` | Pendente |
| Decidir destino de `types/independentes/` | Pendente |
| Adicionar licença MIT | Pendente |

### Sprint 2 — Cálculo

**Objetivo:** transformar sugestões de fórmulas em resultados numéricos.

- Campos de entrada para valores das variáveis selecionadas
- Avaliação numérica da expressão isolada
- Validação de unidades compatíveis
- Exibição do resultado com unidade correta

### Sprint 3 — Experiência

**Objetivo:** melhorar a jornada do estudante na resolução de problemas.

- Cadeias de inferência (quando faltam 2+ variáveis, sugerir caminho)
- Passo a passo da resolução
- Expandir catálogo (termodinâmica, ondas, eletromagnetismo)
- Histórico de problemas resolvidos (localStorage)

### Sprint 4 — Qualidade e deploy

**Objetivo:** preparar o app para uso real.

- Testes E2E (Playwright)
- CI com lint + build + testes
- Deploy (Vercel ou similar)
- Polish de UI e acessibilidade
- PWA básico (opcional)

## Backlog da Sprint 1

Itens concretos para começar a trabalhar na branch `sprint-1`:

1. **[fix]** Corrigir `formula.expressao` → `formula.expressaoPrincipal` em `CatalogoFormulas.tsx`
2. **[feat]** Atualizar `app/layout.tsx`: `lang="pt-BR"`, título e descrição do app
3. **[test]** Configurar Vitest e escrever testes para `inferirFormulas()`
4. **[chore]** Adicionar `LICENSE` (MIT)
5. **[refactor]** Avaliar `types/independentes/` — integrar ao catálogo ou remover
6. **[docs]** Criar issues no GitHub a partir deste backlog

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
2. Trabalhe na branch `sprint-1` (ou crie `feature/*` a partir dela)
3. Abra PR para `sprint-1` ao concluir uma feature
4. Ao final da sprint, PR de `sprint-1` → `main`
