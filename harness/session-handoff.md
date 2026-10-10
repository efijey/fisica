# Session handoff

## Verificado agora

- Branch `feature/consolidar-treino-personalizado`: trabalho local + treino personalizado da nuvem juntos.
- `./init.sh` ok (physics-core + ingestor); `npm run build` ok.

## Mudou nesta sessão

- Treino personalizado (`exp-005`): juiz ligado, rubrica fixa por card, exercícios modelo, modelo configurável (`OPENAI_MODEL_PERSONALIZADO`, autor usa `gpt-4.1`).
- Docs híbridos: `mente.md` removido; visão e paciente zero em `docs/roadmap.md`; `manual.md`, `personalizacao.md`, `fontes-cientificas.md`, `mvp-producao.md` como docs de tópico.
- Regras: commit livre em branch, push/merge com aprovação; decisões por perguntas com opções.

## Quebrado ou sem verificar

- `npm run lint`: 2 erros pré-existentes (`GraficosEquacoes.tsx:518`, `MesaCalculoMental.tsx:97`) — `qa-002`.
- `exp-003` (voz) pausada sem verificação ponta a ponta.
- Sem E2E (`qa-001`).

## Próximo passo

- **Feature:** `qa-002`, depois a trilha de Física 1 (`study-001` → `study-004`).
- **Por quê:** baseline precisa estar verde antes de feature nova; o autor quer estudar o semestre com o app.
- **Passing (qa-002):** `npm run lint` sem erros.
- **Não mexer:** auth do ingestor, cadeias de inferência, deploy.

## Comandos

- Startup: `./init.sh` → `npm run dev`
- Verificação: `npm test`, `npm run lint`, `npm run build`
