# physics-core

Fonte da verdade das fórmulas, variáveis, fenômenos, gráficos e do motor de inferência. Sem UI.

Detalhe em `docs/physics-core.md`.

## Mapa

| Caminho | O que é |
|---------|---------|
| `src/physics/formulas/catalog.ts` | Fórmulas manuais + merge com geradas |
| `src/physics/variables/catalog.ts` | Grandezas |
| `src/physics/phenomena/catalog.ts` | Fenômenos / entidades |
| `src/physics/engine/inferencia.ts` | Match quando falta 1 variável |
| `src/physics/engine/conexoes.ts` | Grafo variável ↔ fórmula ↔ fenômeno |
| `src/generated/` | Saída de `npm run export-catalog` — **não editar** |

## Regras deste pacote

- Mudança no motor precisa de teste em `src/physics/engine/*.test.ts`.
- Não editar `src/generated/*` à mão.
- Não colocar componente React aqui.

## Verificar

```bash
npm run test -w @fisica/physics-core
```
