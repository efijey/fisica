<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agentes — Projeto Física

Antes de implementar ou planejar:

1. Leia **[`docs/mente.md`](docs/mente.md)** (contexto vivo: visão, estado, arquitetura, MVP).
2. Consulte **[`docs/roadmap.md`](docs/roadmap.md)** e **[`docs/git-workflow.md`](docs/git-workflow.md)**.
3. Siga as regras em **`.cursor/rules/`** (sempre aplicadas).

## Princípios deste repositório

- Produto = **explicadora** (`apps/explicadora`); ingestor é ferramenta interna.
- Trabalho **iterável**: branch → commits pequenos → push → PR → fácil reverter.
- Explicar em português claro; o mantenedor está aprendendo boas práticas.
- Não expandir escopo além do pedido / da sprint (MVP apresentável é a prioridade atual).
- Se a conversa mudar visão ou prioridades, **atualize `docs/mente.md`** na mesma linha de trabalho.
