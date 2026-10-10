# Progresso

Log de sessão. O próximo agente começa por aqui, não pelo histórico do chat.

## Estado verificado agora

- **Raiz:** `/Users/fabiojuniorramos/Desenvolvimento/fisica`
- **Startup:** `./init.sh` depois `npm run dev` e, se precisar, `npm run dev:ingestor`
- **Verificação:** `npm test` (physics-core + parser do ingestor)
- **Feature ativa:** `exp-003` — cálculo mental por voz
- **Blocker:** nenhum documentado

## O que já está no repo

Monorepo com explicadora, ingestor e `physics-core`. Sprint 3 (ingestor + export de catálogo/problemas) está no código. Há WIP não commitado em voz/STT/folha mental e em listas/rascunhos do ingestor.

## Registro de sessões

### 2026-09-09 — montar o harness

- **Objetivo:** aplicar harness engineering mínimo (instruções, estado, verificação, escopo, ciclo de sessão).
- **Feito:** `AGENTS.md` como mapa; `init.sh`; estado em `harness/`; AGENTS.md por pacote; docs de tópico.
- **Verificação:** `./init.sh` — physics-core 19/19, ingestor 3/3.
- **Próximo passo:** uma sessão só em `exp-003` (cálculo mental por voz). Não abrir `ing-002` / `core-005` no mesmo turno.
