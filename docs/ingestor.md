# Ingestor de Exercícios

App interno para colar exercícios de física, catalogar fórmulas/variáveis/fenômenos e exportar exemplos aprovados para a explicadora.

## Setup Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Rode a migration em `supabase/migrations/20260707130000_exercises_schema.sql` (SQL Editor ou CLI)
3. Copie `apps/ingestor/.env.example` para `apps/ingestor/.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Comandos

```bash
# Explicadora (porta 3000)
npm run dev:explicadora

# Ingestor (porta 3001)
npm run dev:ingestor

# Exportar exercícios aprovados → apps/explicadora/app/physics/examples/catalog.ts
npm run export-catalog
```

## Fluxo

1. Cole o enunciado em `/exercicios/novo`
2. O parser por **regras** (opção A) cataloga automaticamente como `rascunho`
3. Revise em `/exercicios/[id]` e **aprove** ou **rejeite**
4. Rode `npm run export-catalog` para sincronizar com a explicadora

A resposta numérica é usada só para validação interna — não vai para o app do estudante.
