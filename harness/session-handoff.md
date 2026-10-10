# Session handoff

## Verificado agora

- Branch `feature/consolidar-treino-personalizado`: trabalho local + treino personalizado da nuvem juntos.
- `./init.sh` ok (physics-core + ingestor); `npm run build` ok.

## Mudou nesta sessão

- Treino personalizado (`exp-005`): juiz ligado, rubrica fixa por card, exercícios modelo, modelo configurável (`OPENAI_MODEL_PERSONALIZADO`, autor usa `gpt-4.1`).
- Docs híbridos: `mente.md` removido; visão e paciente zero em `docs/roadmap.md`; `manual.md`, `personalizacao.md`, `fontes-cientificas.md`, `mvp-producao.md` como docs de tópico.
- Regras: commit livre em branch, push/merge com aprovação; decisões por perguntas com opções.

- Lint verde (`qa-002` passing): 0 erros, 2 avisos de variável não usada.
- Rascunho da ementa em `docs/ementa-fisica-1.md` (`study-001`).
- Equações em LaTeX com KaTeX (`study-002` passing), branch `feature/equacoes-katex`: componente `components/physics/Equacao.tsx` e página `/estudo` (prévia, vira a casa da trilha).
- Capítulo 1 sem lente em `/estudo` (`study-003` in_progress), branch `feature/trilha-capitulo-1`: 8 exercícios conceituais com juiz (um por seção); aguardando o autor ler e testar.
- Fonte do site corrigida: `--font-sans` apontava para si mesma e o site todo caía em fonte serifada.

## Quebrado ou sem verificar

- `exp-003` (voz) pausada sem verificação ponta a ponta. A troca do modo de voz (efeito → `useSyncExternalStore`) passou em lint/build, mas não foi testada no navegador.
- Sem E2E (`qa-001`).

## Próximo passo

- **Feature:** `study-003` (capítulo 1): autor revisa texto e exercícios em `/estudo`; depois a lente (`study-004`). `study-001` (ementa) também aguarda leitura do autor.
- **Por quê:** o autor quer estudar o semestre com o app.
- **Passing (study-001):** autor aprova a ementa.
- **Não mexer:** auth do ingestor, cadeias de inferência, deploy.

## Comandos

- Startup: `./init.sh` → `npm run dev`
- Verificação: `npm test`, `npm run lint`, `npm run build`
