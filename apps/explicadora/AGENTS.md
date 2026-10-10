# Explicadora

App Next.js 16 (App Router) na porta **3000**. É o produto do estudante: entender *por que* uma fórmula se aplica, não só obter o número.

Antes de mudar rotas, APIs ou convenções do Next, leia `node_modules/next/dist/docs/` neste app.

## Mapa

| Caminho | O que é |
|---------|---------|
| `app/pages/Calculadora/index.tsx` | Shell: abas Inferência, Explorar, Catálogo, Gráficos, Problemas |
| `components/physics/` | UI de domínio |
| `app/physics/problemas/` | Problemas conceituais, juiz e cálculo mental |
| `app/physics/examples/` | Exemplos exportados do ingestor |
| `app/api/mental/` | STT e turno do tutor |

Fórmulas, variáveis, fenômenos e o motor vêm de `@fisica/physics-core`. Não duplique catálogo aqui.

## Regras deste app

- Não mostrar gabarito numérico ao estudante.
- `catalog.generated.ts` é export — não editar à mão.
- Problemas manuais ficam em `app/physics/problemas/catalog.ts`.
- Feature ativa: `exp-003` (voz / folha mental). Detalhe em `docs/explicadora.md`.

## Verificar

```bash
npm run dev -w @fisica/explicadora   # http://localhost:3000
npm run lint -w @fisica/explicadora
```

Não há teste E2E neste pacote ainda (`qa-001`). Mudança de UI precisa ser exercitada no browser.
