# Harness engineering neste repo

O modelo escreve código. O **harness** decide o que ler, o que pode mudar, como provar que terminou e como a próxima sessão retoma. Sem isso, cada chat começa do zero e declara "pronto" sem evidência.

Base: [Learn Harness Engineering](https://github.com/walkinglabs/learn-harness-engineering) — cinco subsistemas, aplicados no mínimo.

## Os cinco subsistemas

| Subsistema | Neste repo | Função |
|------------|------------|--------|
| Instruções | `AGENTS.md` na raiz + um por pacote + `docs/` | Mapa curto; detalhe só quando a tarefa pede |
| Estado | `harness/feature_list.json`, `progress.md`, `session-handoff.md` | O chat não é memória |
| Verificação | `./init.sh` → `npm test` | "Done" exige comando que rodou |
| Escopo | uma feature `in_progress` | Evita três meias-features |
| Ciclo de sessão | startup em `AGENTS.md`, handoff no fim | A próxima sessão não adivinha |

## Disclosure progressivo

`AGENTS.md` da raiz tem ~80 linhas: o que o projeto é, comandos, restrições, links. Não coloque guia de Supabase, STT ou catálogo lá. Isso mora no doc de tópico e no `AGENTS.md` da pasta.

Se o agente errar, a reação ruim é "adicionar mais uma regra no arquivo gigante". A boa é: teste que pega o erro, ou um doc de tópico com condição de uso.

## Ciclo de uma sessão

```
lê AGENTS.md → lê harness/progress.md → escolhe UMA feature
    → ./init.sh (baseline verde)
    → implementa só aquilo
    → roda a verificação da feature
    → atualiza harness/ e pergunta se pode commitar
```

Commit não faz parte do ciclo automático: só com pedido explícito.

## O que ainda não vamos copiar do curso

Loops automatizados (maker-checker), grafo de orquestração, rubrica de avaliador e quality document. Primeiro o harness mínimo tem que ser o caminho que a gente realmente usa.
