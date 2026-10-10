# Manual do sistema — Física Explicadora

Guia **estável** para humanos e agentes: como o projeto está organizado, onde mora cada tipo de responsabilidade e **por onde começar a procurar** informação.

Não é um inventário de cada arquivo (isso muda a cada sprint). É um mapa mental: se você souber a *pergunta*, este manual aponta a *região* do repositório.

| Documento | Quando usar |
|-----------|-------------|
| **Este manual** | “Onde fica X?” / explicar a arquitetura para alguém |
| [`mente.md`](./mente.md) | Visão do produto, estado atual, prioridades da sprint |
| [`roadmap.md`](./roadmap.md) | O que já foi feito e o que vem depois |
| [`git-workflow.md`](./git-workflow.md) | Branches, commits, como reverter |
| [`mvp-producao.md`](./mvp-producao.md) | Checklist para colocar no ar |
| [`ingestor.md`](./ingestor.md) | Setup prático do alimentador + Supabase |
| `README.md` (raiz) | Setup rápido e visão de uma página |

---

## 1. Ideia em camadas (o mais importante)

Pense no sistema como **três caixas** com responsabilidades diferentes:

```
┌─────────────────────────────────────────────────────────┐
│  APPS (interfaces)                                      │
│  explicadora = o que o estudante vê                     │
│  ingestor    = ferramenta interna de catalogar exercícios│
└───────────────────────────┬─────────────────────────────┘
                            │ usa
┌───────────────────────────▼─────────────────────────────┐
│  PHYSICS-CORE (cérebro de física)                       │
│  fórmulas, variáveis, fenômenos, motor de inferência    │
│  Sem tela. Sem banco. Só lógica e dados de domínio.     │
└───────────────────────────┬─────────────────────────────┘
                            │ (só o ingestor, por enquanto)
┌───────────────────────────▼─────────────────────────────┐
│  SUPABASE (banco + auth)                                │
│  exercícios colados, análises, status aprovar/rejeitar  │
└─────────────────────────────────────────────────────────┘
```

**Regra de ouro:** se a mudança é sobre *física* (fórmula, variável, “qual equação falta uma grandeza?”), quase sempre começa em `packages/physics-core`.  
Se é sobre *tela / botão / aba*, está em `apps/explicadora` ou `apps/ingestor`.  
Se é sobre *guardar exercício no banco*, é Supabase + código em `apps/ingestor`.

---

## 2. Mapa das pastas na raiz

```
fisica/
├── apps/                 → programas que rodam (Next.js)
│   ├── explicadora/      → produto público (estudante)
│   └── ingestor/         → ferramenta interna
├── packages/
│   └── physics-core/     → domínio compartilhado (lógica + catálogos)
├── supabase/
│   └── migrations/       → “contratos” do banco (SQL versionado)
├── docs/                 → manuais e planejamento (este arquivo mora aqui)
├── .cursor/rules/        → regras automáticas para o agente de IA
├── package.json          → scripts do monorepo (dev, test, build…)
└── README.md             → porta de entrada do repositório
```

| Pasta | Responsabilidade | Em uma frase |
|-------|------------------|--------------|
| `apps/explicadora` | UI do estudante | “O site que a gente apresenta” |
| `apps/ingestor` | UI + APIs internas | “Onde a gente cola e aprova exercícios” |
| `packages/physics-core` | Domínio | “A física em si, reutilizável” |
| `supabase` | Persistência | “Como o banco deve existir” |
| `docs` | Conhecimento | “O que não cabe só no código” |

Isso é **separação por responsabilidade**: cada pasta tem um motivo de existir. Novas sprints devem *respeitar* essas caixas, não misturar tudo numa pasta só.

---

## 3. Como o Next.js organiza rotas (vale para os dois apps)

Neste projeto usamos o **App Router** do Next.js. A regra é visual:

| Tipo de arquivo | Significado |
|-----------------|-------------|
| `app/page.tsx` | Página da URL correspondente à pasta |
| `app/alguma-pasta/page.tsx` | Página em `/alguma-pasta` |
| `app/api/.../route.ts` | Endpoint de API (HTTP), não página HTML |
| `app/layout.tsx` | Casca comum (HTML, fontes, providers) |
| pasta `[id]` | Parâmetro dinâmico na URL (ex.: `/exercicios/abc-123`) |

Você **não precisa** memorizar todas as URLs — só lembrar: *procure `page.tsx` para telas e `route.ts` para APIs*.

### 3.1 Rotas da explicadora (produto)

| URL | Arquivo | O que é |
|-----|---------|---------|
| `/` | `apps/explicadora/app/page.tsx` | Entrada; renderiza a Calculadora |
| UI principal (abas) | `apps/explicadora/app/pages/Calculadora/index.tsx` | Inferência, Explorar, Catálogo, Gráficos, Problemas |
| `POST /api/mental/turno` | `apps/explicadora/app/api/mental/turno/route.ts` | Turno da mesa mental (LLM ou mock) |

Quase toda a experiência do estudante é **uma página com abas**, não um monte de URLs diferentes.

### 3.2 Rotas do ingestor (interno)

| URL | Arquivo | O que é |
|-----|---------|---------|
| `/` | `apps/ingestor/app/page.tsx` | Home do alimentador |
| `/exercicios` | `.../exercicios/page.tsx` | Lista |
| `/exercicios/novo` | `.../exercicios/novo/page.tsx` | Colar enunciado |
| `/exercicios/[id]` | `.../exercicios/[id]/page.tsx` | Detalhe / aprovar / rejeitar |
| `POST/GET /api/exercicios` | `.../api/exercicios/route.ts` | Criar / listar no banco |
| `/api/exercicios/[id]` | `.../api/exercicios/[id]/route.ts` | Um exercício |
| `/api/analisar` | `.../api/analisar/route.ts` | Rodar o parser por regras |

---

## 4. Onde está a lógica (por tipo de pergunta)

Use esta tabela como índice. É o coração do manual.

### 4.1 Física e “cérebro”

| Pergunta | Onde olhar |
|----------|------------|
| Quais fórmulas existem? | `packages/physics-core/src/physics/formulas/` |
| Quais variáveis (grandezas)? | `.../variables/` |
| Quais fenômenos / contextos? | `.../phenomena/` |
| Como o app sugere fórmula a partir das variáveis selecionadas? | `.../engine/inferencia.ts` |
| Como variável ↔ fórmula ↔ fenômeno se conectam? | `.../engine/conexoes.ts` |
| Dados de gráficos de equações? | `.../graficos/` |
| O que o pacote exporta para os apps? | `packages/physics-core/src/index.ts` |

**Padrão dentro de `physics-core`:**  
- `catalog.ts` → lista / dados estruturados  
- `metadata.ts` → textos explicativos (quando existirem)  
- `*.test.ts` → testes daquela lógica  

### 4.2 Interface do estudante (explicadora)

| Pergunta | Onde olhar |
|----------|------------|
| Abas e layout principal | `apps/explicadora/app/pages/Calculadora/` |
| Componentes de física (listas, cards, mesa…) | `apps/explicadora/components/physics/` |
| Componentes genéricos de UI (botão, tabs…) | `apps/explicadora/components/ui/` (shadcn) |
| Problemas conceituais (enunciados + rubrica) | `apps/explicadora/app/physics/problemas/` |
| Mesa mental / voz / LLM | `.../problemas/mental/` + `app/api/mental/` |
| Exemplos exportados do ingestor | `apps/explicadora/app/physics/examples/` |
| Utilitários CSS/classes | `apps/explicadora/lib/` |

### 4.3 Ingestor e banco

| Pergunta | Onde olhar |
|----------|------------|
| Como o enunciado vira fórmulas/variáveis (regras)? | `apps/ingestor/lib/parser/` |
| Como falamos com o Supabase? | `apps/ingestor/lib/supabase/` |
| Operações de ler/gravar exercícios | `apps/ingestor/lib/db/` |
| Tipos TypeScript do domínio do ingestor | `apps/ingestor/lib/types.ts` |
| Exportar aprovados para a explicadora | `apps/ingestor/scripts/export-catalog.ts` |
| Formato das tabelas / políticas RLS | `supabase/migrations/*.sql` |

### 4.4 Configuração e ambiente

| Pergunta | Onde olhar |
|----------|------------|
| Scripts `npm run …` do monorepo | `package.json` (raiz) |
| Dependências de um app | `apps/<nome>/package.json` |
| Variáveis de ambiente (modelo) | `apps/*/ .env.example` |
| Regras para o agente Cursor | `.cursor/rules/` |

---

## 5. Fluxos principais (abstratos)

### 5.1 Estudante usa a Inferência

```
UI (Calculadora / aba Inferência)
    → seleciona IDs de variáveis
    → chama inferirFormulas() do physics-core
    → mostra fórmulas onde falta exatamente 1 variável
```

Não passa pelo banco. Tudo em memória + catálogos do pacote.

### 5.2 Estudante treina em Problemas

```
Catálogo estático de problemas (app/physics/problemas)
    → juiz conceitual (rubrica / texto)
    → opcional: mesa mental
         → API /api/mental/turno
         → LLM (se houver chave) ou mock
```

Também **não depende** do Supabase hoje.

### 5.3 Equipe alimenta exercícios (ingestor)

```
Colar enunciado na UI
    → API analisar (parser por regras)
    → grava no Supabase (rascunho)
    → humano aprova / rejeita
    → npm run export-catalog
    → arquivo TypeScript na explicadora (examples/catalog.ts)
```

Aqui entra o **banco**. A explicadora, no fluxo atual de Problemas, ainda usa catálogo próprio; o export prepara a ponte para o futuro.

---

## 6. Banco de dados — o que você precisa entender

### 6.1 Papel do Supabase neste projeto

| Sim | Não (ainda) |
|-----|-------------|
| Guardar exercícios colados e análises | Ser o “cérebro” da física |
| Status: rascunho / aprovado / rejeitado… | Login de alunos na explicadora |
| Usado pelo **ingestor** | Obrigatório para a demo pública da explicadora |

A física “de verdade” (fórmulas, motor) vive em **código** (`physics-core`). O banco guarda **instâncias de exercícios** e metadados de análise.

### 6.2 Onde está a “verdade” do schema

Arquivos em `supabase/migrations/`.  
São SQL versionado: cada arquivo descreve tabelas, enums, índices, RLS (segurança por linha).

Quando alguém perguntar “quais tabelas existem?”, a resposta confiável é: **abra a migration**, não só o painel do Supabase.

### 6.3 Conceitos úteis (sem jargão pesado)

- **Tabela** — planilha estruturada (ex.: `exercises`)
- **Migration** — receita versionada para criar/alterar o banco
- **RLS** — regras de quem pode ler/escrever cada linha
- **Anon key / service role** — chaves do cliente vs. chave privilegiada (nunca commitada em `.env.local` no Git)
- **`.env.example`** — lista o que configurar; **não** contém segredos reais

Setup passo a passo: [`ingestor.md`](./ingestor.md).

### 6.4 Quando formos precisar de mais banco

Perguntas típicas da próxima fase (MVP / produção):

1. A explicadora pública precisa persistir algo? (hoje: não)
2. Só o ingestor continua no Supabase? (provável no MVP)
3. Auth de admin no ingestor — sim, é pendência conhecida

Novas tabelas → **nova migration** em `supabase/migrations/`, nunca só “clicar no painel” sem versionar.

---

## 7. Monorepo e comandos (visão operacional)

Um **monorepo** = vários projetos no mesmo Git, com um `package.json` na raiz.

| Comando (na raiz) | Efeito |
|-------------------|--------|
| `npm run dev:explicadora` | Site do estudante `:3000` |
| `npm run dev:ingestor` | Alimentador `:3001` |
| `npm test` | Testes do core + parser |
| `npm run build` | Build da explicadora |
| `npm run export-catalog` | Sincroniza exercícios aprovados → explicadora |

Cada app também tem seu próprio `package.json` com dependências específicas.

---

## 8. Como explicar o projeto para outras pessoas (roteiro curto)

Use esta ordem — funciona para professora, colega ou banca:

1. **Problema:** alunos decoram fórmula sem entender o porquê.  
2. **Proposta:** app que conecta grandezas, fórmulas e fenômenos.  
3. **Arquitetura em 3 caixas:** interface (explicadora) · cérebro (`physics-core`) · banco só para alimentar conteúdo (ingestor/Supabase).  
4. **Demo na tela:** Inferência → Explorar → Problemas.  
5. **Como trabalhamos:** sprints, branches, commits pequenos, docs vivos (`mente` + este manual).

Detalhes de demo: [`mvp-producao.md`](./mvp-producao.md).

---

## 9. Como este manual permanece confiável ao longo das sprints

### O que *não* deve envelhecer rápido

- As **três caixas** (apps / core / banco)
- A regra `page.tsx` = tela, `route.ts` = API
- A tabela “pergunta → pasta” (atualize só quando criar uma *região* nova)

### O que *vai* mudar (e onde olhar em vez daqui)

| Muda com frequência | Fonte da verdade |
|---------------------|------------------|
| Status da sprint, prioridades | `docs/mente.md`, `docs/roadmap.md` |
| Lista exata de fórmulas/problemas | arquivos `catalog.ts` no código |
| Issues do GitHub | GitHub (podem ficar defasadas; mente > issue antiga) |
| URL de produção | mente + README quando existir deploy |

### Checklist ao mudar a arquitetura

Se uma sprint criar pasta importante, novo app, ou novo papel para o banco:

1. Atualizar a seção correspondente **neste manual** (mapa + tabela de perguntas)  
2. Atualizar `docs/mente.md` (estado / prioridades)  
3. Commit `docs(manual): …` na mesma PR da mudança estrutural  

Assim o manual continua sendo o mapa, e a mente continua sendo o “agora”.

---

## 10. Mini-fluxo: “preciso achar uma coisa”

```
1. É visão/prioridade?     → docs/mente.md
2. É “onde fica no código”? → este manual (seção 4)
3. É tela?                 → apps/.../app/**/page.tsx ou components/
4. É API?                  → apps/.../app/api/**/route.ts
5. É física pura?          → packages/physics-core
6. É banco/schema?         → supabase/migrations + apps/ingestor/lib
7. É como versionar?       → docs/git-workflow.md
```

Se ainda estiver perdido: abra `docs/mente.md` → seção “Onde olhar no código” e volte aqui pela pergunta da seção 4.
