# Explicadora

App do estudante em `apps/explicadora`. Porta **3000**. Next.js 16 App Router, React 19, Tailwind 4, shadcn/ui.

Objetivo: compreensão. O estudante sai entendendo por que a fórmula se aplica e como as grandezas se relacionam — não só um número.

## Superfície

Shell em `app/pages/Calculadora/index.tsx`:

| Aba | Comportamento |
|-----|----------------|
| Inferência | Seleciona grandezas conhecidas → `inferirFormulas()` do physics-core |
| Explorar grandezas | Grafo variável ↔ fórmula ↔ fenômeno |
| Catálogo de fórmulas | Navegação por área |
| Gráficos | Equações do catálogo de gráficos |
| Problemas | Enunciado conceitual + juiz em palavras; mesa mental (WIP) |

## Dados

- Fórmulas / variáveis / fenômenos / motor: `@fisica/physics-core`
- Problemas manuais: `app/physics/problemas/catalog.ts`
- Problemas exportados: `app/physics/problemas/catalog.generated.ts` (não editar)
- Exemplos: `app/physics/examples/catalog.ts`

## Cálculo mental (`exp-003`)

Pasta `app/physics/problemas/mental/` + `components/physics/MesaCalculoMental.tsx`.

Fluxo pretendido: fala → STT (Whisper `/api/mental/stt`, senão Web Speech, senão mock) → turno (`/api/mental/turno`) → operações na folha. O tutor não entrega gabarito numérico.

## Verificar

```bash
npm run dev          # raiz
npm run lint
```

Mudança de UI: exercitar o fluxo no browser. E2E ainda é `qa-001`.
