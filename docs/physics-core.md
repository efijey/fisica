# physics-core

Pacote `@fisica/physics-core`. Catálogos e motor, sem UI. Consumido pela explicadora e pelo ingestor.

## Catálogos

Arquivos manuais em `src/physics/{formulas,variables,phenomena,graficos}/`. Cada catálogo manual faz merge com o correspondente em `src/generated/`.

`src/generated/` é saída de `npm run export-catalog` no ingestor. Editar à mão é descartado no próximo export.

Áreas conhecidas (labels/cores) em `src/areas.ts`; áreas novas podem vir do gerado.

## Motor

`inferirFormulas(variaveisDisponiveis)` percorre o catálogo e devolve fórmulas em que **falta exatamente uma** variável, com a variação já isolada. Não encadeia etapas (`core-005`).

`conexoes.ts` monta o grafo variável ↔ fórmula ↔ fenômeno para a aba Explorar.

## Verificar

```bash
npm run test -w @fisica/physics-core
```

Testes: `src/physics/engine/inferencia.test.ts`, `conexoes.test.ts`. Mudança de regra de inferência ou de id de variável/fórmula precisa passar por aqui — ids quebram o ingestor e os problemas.
