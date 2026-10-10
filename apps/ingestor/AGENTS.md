# Ingestor

App Next.js 16 interno na porta **3001**. Ingere listas/exercícios, propõe itens de catálogo e exporta o que foi aprovado para a explicadora e o `physics-core`.

Leia `node_modules/next/dist/docs/` antes de mudar App Router, rotas ou `next.config`. Setup completo: `docs/ingestor.md`.

## Mapa

| Caminho | O que é |
|---------|---------|
| `app/listas/nova` | Colar texto ou enviar PDF |
| `app/exercicios` | Fila de exercícios |
| `app/catalogo/rascunhos` | Propostas de área/fórmula/variável/fenômeno/gráfico |
| `lib/parser/analisar.ts` | Parser por regras (fallback) |
| `lib/llm/analisar-exercicio.ts` | Pré-resolução via OpenAI |
| `scripts/export-catalog.ts` | Gera código a partir do Supabase |

## Regras deste app

- Não commitar `.env.local`. Copiar de `.env.example`.
- Não editar arquivos gerados pelo export — rode `npm run export-catalog`.
- A resposta numérica da análise é só para o operador, não para o estudante.
- `INGESTOR_SKIP_AUTH=true` é atalho de dev; auth de verdade é `ing-002`.

## Verificar

```bash
npm run test -w @fisica/ingestor
npm run dev:ingestor    # na raiz → http://localhost:3001
```
