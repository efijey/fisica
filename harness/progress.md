# Progresso

Log de sessão. O próximo agente começa por aqui, não pelo histórico do chat.

## Estado verificado agora

- **Raiz:** `/Users/fabiojuniorramos/Desenvolvimento/fisica`
- **Startup:** `./init.sh` depois `npm run dev` e, se precisar, `npm run dev:ingestor`
- **Verificação:** `npm test` (physics-core + parser do ingestor)
- **Feature ativa:** `study-001` — ementa de Física 1 em revisão (`docs/ementa-fisica-1.md`); depois `study-002` a `study-004`
- **Blocker:** nenhum documentado

## O que já está no repo

Monorepo com explicadora, ingestor e `physics-core`. Sprint 3 (ingestor + export de catálogo/problemas) está no código. Aba Treino personalizado (TFT/LoL + cards de literatura + juiz) consolidada na branch `feature/consolidar-treino-personalizado`. Voz/folha mental (`exp-003`) commitada mas pausada.

## Direção do autor (paciente zero)

Estudante de física; vai usar o app no semestre de Física 1 (cinemática, Newton, trabalho e energia, com cálculo). Livro: Young & Freedman. Uso local. O mundo (TFT/LoL) funciona como idioma do site: só a pele muda (intuição, analogias, exemplos, exercícios); textos por mundo gerados uma vez, revisados e salvos. Decisões são apresentadas como perguntas com opções.

## Registro de sessões

### 2026-09-09 — montar o harness

- **Objetivo:** aplicar harness engineering mínimo (instruções, estado, verificação, escopo, ciclo de sessão).
- **Feito:** `AGENTS.md` como mapa; `init.sh`; estado em `harness/`; AGENTS.md por pacote; docs de tópico.
- **Verificação:** `./init.sh` — physics-core 19/19, ingestor 3/3.
- **Próximo passo:** uma sessão só em `exp-003` (cálculo mental por voz). Não abrir `ing-002` / `core-005` no mesmo turno.

### 2026-10-10 — consolidar nuvem + local; treino personalizado

- **Objetivo:** juntar o trabalho de um agente na nuvem (branches `cursor/*-5cf5`, PRs #8 e #9) com o WIP local, e melhorar o treino personalizado.
- **Feito:** WIP local commitado em `feature/harness-e-ingestor-listas` (4 commits, push feito). Treino personalizado: botão enviar ligado ao juiz, explicação só após envio, rubrica fixa por card, exercícios modelo no prompt, modelo configurável (`gpt-4.1` escolhido). Merge em `feature/consolidar-treino-personalizado` com docs híbridos (harness como estrutura; `mente.md` removido). Regras: commit livre na branch, push/merge com aprovação; decisões por perguntas com opções. Aba carregada só no cliente (`next/dynamic` com `ssr: false`) para ler localStorage sem effect.
- **Verificação:** `./init.sh` ok; `npm run build` ok; `tsc` ok. `npm run lint` com 2 erros pré-existentes (`qa-002`).
- **Próximo passo:** `qa-002` (lint), depois `study-001` (ementa) → `study-002` (equações) → `study-003` (capítulo 1) → `study-004` (lente).
- **Depois (mesmo dia):** `qa-002` passing — `npm run lint` com 0 erros (GraficosEquacoes sem efeito; MesaCalculoMental com `useSyncExternalStore`), build e tsc ok. Rascunho da ementa em `docs/ementa-fisica-1.md` (`study-001`, aguardando revisão).
- **Depois (2):** filosofia registrada em `docs/roadmap.md` (livro para qualquer pessoa; público em transição: cursinho, 1º ano). `study-002` passing na branch `feature/equacoes-katex` (KaTeX + `/estudo`, conferido no navegador). Fonte Geist corrigida no `globals.css`.
- **Pasta auxiliar:** worktree `../fisica-tft` na branch `feature/treino-personalizado-qualidade`, servindo em `localhost:3002`; pode ser removida após o merge (`git worktree remove ../fisica-tft`).
