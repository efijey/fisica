<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Física — harness do agente

Monorepo de uma explicadora de física (foco no *porquê*, não no número) e de um ingestor interno de exercícios. Este arquivo é um **mapa**, não o manual. Leia só os docs do tópico da tarefa.

## Antes de escrever código

1. `pwd` — confirmar que está na raiz do repo.
2. Ler `harness/progress.md` e `harness/session-handoff.md`.
3. Ler `harness/feature_list.json` e pegar **uma** feature `in_progress` ou a de maior prioridade `not_started`.
4. `git log --oneline -8` e o `AGENTS.md` do pacote em que vai mexer.
5. Rodar `./init.sh` se a sessão ainda não verificou o baseline.

Se o baseline já estiver quebrado, conserte isso antes de feature nova.

## O que é o quê

| Caminho | Papel |
|---------|--------|
| `apps/explicadora` | App do estudante (porta 3000) |
| `apps/ingestor` | App interno de catálogo (porta 3001) |
| `packages/physics-core` | Fórmulas, variáveis, fenômenos, inferência |
| `supabase/migrations` | Schema Postgres |
| `harness/` | Estado da sessão (o chat não é fonte da verdade) |
| `docs/` | Docs de tópico, sob demanda |

## Comandos

```bash
./init.sh                 # install se faltar + testes
npm run dev               # explicadora :3000
npm run dev:ingestor      # ingestor :3001
npm test                  # physics-core + parser do ingestor
npm run lint              # explicadora
npm run export-catalog    # aprovados do Supabase → código gerado
```

## Restrições (não negociar)

- Commits pequenos são livres, sempre numa branch. Push, merge e PR só com aprovação do usuário.
- Uma feature por vez. Não reescrever `feature_list.json` para esconder trabalho inacabado.
- `passing` só com verificação **rodada** e evidência no harness.
- Não editar à mão `packages/physics-core/src/generated/*` nem `apps/explicadora/app/physics/problemas/catalog.generated.ts` — saem de `npm run export-catalog`.
- Não expor gabarito numérico ao estudante na explicadora.
- Não commitar `.env`, `.env.local` nem chaves.
- Next.js 16: ler `node_modules/next/dist/docs/` no app em que estiver trabalhando, não a memória de versões antigas.

## Docs de tópico — ler só o da tarefa

- Visão e fases: `docs/roadmap.md`
- Como o harness funciona: `docs/harness.md`
- Explicadora (UI, problemas, voz): `docs/explicadora.md`
- Ingestor e Supabase: `docs/ingestor.md`
- Motor e catálogos: `docs/physics-core.md`
- Git e commits: `docs/git-workflow.md`
- Personalização por mundo (TFT/LoL, tags): `docs/personalizacao.md`
- Fontes científicas e cards de literatura: `docs/fontes-cientificas.md`
- Mapa do sistema para humanos (pastas, rotas, banco): `docs/manual.md`

O autor está aprendendo boas práticas: explicar em português simples e apresentar decisões como perguntas com opções.

AGENTS.md locais (página do diretório): `apps/explicadora/AGENTS.md`, `apps/ingestor/AGENTS.md`, `packages/physics-core/AGENTS.md`.

## Definition of done

A feature só está `passing` quando:

1. o comportamento alvo existe;
2. a verificação listada na feature **rodou**;
3. a evidência está em `harness/feature_list.json` ou `harness/progress.md`;
4. o próximo agente consegue retomar só com `./init.sh` + harness.

## Fim de sessão

1. Atualizar `harness/progress.md` e `harness/session-handoff.md`.
2. Atualizar o status em `harness/feature_list.json`.
3. Registrar o que ficou quebrado ou sem verificar.
4. Mostrar os commits feitos (`git log --oneline`) e **perguntar** se o usuário quer push / PR.
