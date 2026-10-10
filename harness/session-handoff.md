# Session handoff

## Verificado agora

- Harness mínimo no repo: `AGENTS.md`, `init.sh`, `harness/*`, AGENTS.md nos três pacotes.
- Baseline: `./init.sh` passou (physics-core 19, ingestor 3).

## Mudou nesta sessão

- Organização do harness (instruções + estado + ciclo de sessão).
- Docs de tópico em `docs/` e índice em `docs/README.md`.
- README e roadmap apontam para o harness como estado operacional.

## Quebrado ou sem verificar

- `exp-003` (cálculo mental por voz) está a meio — arquivos novos/modificados na explicadora, sem evidência de verificação ponta a ponta.
- Há WIP grande no ingestor (listas, PDF, rascunhos, análise LLM) ainda não commitado.
- Sem E2E (`qa-001`). Features de UI marcadas `passing` com evidência visual/unitária só.

## Próximo passo

- **Feature:** `exp-003`
- **Por quê:** é a única `in_progress`; o resto do harness já está no lugar.
- **Passing:** mesa mental atualiza a folha com fala; tutor não vaza gabarito; Whisper e fallback funcionam ou estão documentados como limitação.
- **Não mexer:** auth do ingestor, cadeias de inferência, cálculo numérico, CI.

## Comandos

- Startup: `./init.sh` → `npm run dev`
- Verificação: `npm test`
- Foco de debug: `apps/explicadora/components/physics/MesaCalculoMental.tsx` e `apps/explicadora/app/physics/problemas/mental/`
