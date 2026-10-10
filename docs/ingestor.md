# Ingestor de Exercícios

App interno para colar listas/exercícios de física (texto ou PDF), pré-resolver com OpenAI, propor itens de catálogo e exportar o material aprovado para a explicadora.

Mapa curto do pacote: [`apps/ingestor/AGENTS.md`](../apps/ingestor/AGENTS.md).

Contexto geral do monorepo: [manual.md](./manual.md).  
Visão futura (interesses / personalização): [personalizacao.md](./personalizacao.md).

## Setup Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Rode as migrations em `supabase/migrations/` (SQL Editor ou CLI), nesta ordem:
   - `20260707130000_exercises_schema.sql`
   - `20260813160000_lists_and_catalog_drafts.sql`
3. Crie o bucket de Storage `listas-pdf` (privado) se for usar upload de PDF
4. Copie `apps/ingestor/.env.example` para `apps/ingestor/.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
INGESTOR_SKIP_AUTH=true
OPENAI_API_KEY=...   # opcional; sem chave, usa parser por regras
```

## Comandos

```bash
# Explicadora (porta 3000)
npm run dev:explicadora

# Ingestor (porta 3001)
npm run dev:ingestor

# Exportar aprovados → exemplos + problemas + physics-core/generated
npm run export-catalog
```

## Fluxo

1. **Lista:** `/listas/nova` — cole texto ou envie PDF; o sistema separa enunciados e analisa cada um
2. **Único:** `/exercicios/novo` — um enunciado por vez
3. Análise prefere **LLM** (`gpt-4o-mini`); sem `OPENAI_API_KEY`, usa regras
4. Propostas de catálogo (área/fórmula/variável/fenômeno/gráfico) vão para `/catalogo/rascunhos`
5. Aprove exercícios em `/exercicios/[id]` e propostas na fila de rascunhos
6. Rode `npm run export-catalog` para:
   - `apps/explicadora/app/physics/examples/catalog.ts`
   - `apps/explicadora/app/physics/problemas/catalog.generated.ts`
   - `packages/physics-core/src/generated/*`
7. A explicadora passa a listar problemas publicados; fórmulas/grandezas/gráficos novos aparecem após o merge no `physics-core`

A resposta numérica e a pré-resolução são só para validação/revisão interna — o estudante não vê o gabarito bruto.
