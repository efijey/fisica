# Padrões de Git — Projeto Física

Referência para humanos e agentes. Objetivo: **iterar rápido** e **reverter fácil**.

Contexto do produto: [mente.md](./mente.md).

## Por que versionamos assim

O projeto vai crescer em direção a um MVP público. Cada ideia deve:

1. Viver numa **branch** isolada
2. Ter **commits pequenos** e específicos
3. Ir para o **GitHub** via push + PR
4. Poder ser **desfeita** (fechar PR, reverter commit, ou não mergear)

Evite commits gigantes misturando docs, feature e refactor.

## Modelo de branches

Git Flow simplificado orientado a sprints:

| Tipo | Padrão | Exemplo | Base | Uso |
|------|--------|---------|------|-----|
| Principal | `main` | `main` | — | Estável; preferível que compile |
| Sprint | `sprint-N` | `sprint-4` | `main` | Trabalho concentrado da sprint |
| Feature | `feature/<descricao>` | `feature/deploy-vercel` | `sprint-N` | Uma mudança lógica |
| Agente / cloud | `cursor/<descricao>-****` | `cursor/mente-mvp-iteravel-5cf5` | sprint ou `main` | Trabalho de agente (quando aplicável) |
| Hotfix | `hotfix/<descricao>` | `hotfix/catalogo-bug` | `main` | Correção urgente |

### Regras

1. **Não commitar direto em `main`** no dia a dia.
2. Trabalho diário em `sprint-N` ou `feature/*` / `cursor/*` derivadas dela (ou de `main` ao abrir nova sprint).
3. Ao final da sprint: PR `sprint-N` → `main`.
4. Hotfixes: `main` → correção → merge em `main` e na sprint ativa.
5. Nomes sem espaços; use hífens e **minúsculas**.

### Fluxo típico

```
main
 └── sprint-4
      ├── feature/deploy-explicadora
      └── feature/ci-github-actions
```

```bash
# Nova sprint
git checkout main
git pull origin main
git checkout -b sprint-4
git push -u origin sprint-4

# Feature dentro da sprint
git checkout sprint-4
git pull origin sprint-4
git checkout -b feature/minha-ideia

# Durante o trabalho: commits pequenos + push
git add -A
git commit -m "feat(ui): ajustar texto da aba Problemas"
git push -u origin feature/minha-ideia
# Abrir PR: feature/minha-ideia → sprint-4
```

## Convenção de commits

[Conventional Commits](https://www.conventionalcommits.org/) em português:

```
<tipo>(<escopo opcional>): <descrição curta em português>
```

| Tipo | Quando |
|------|--------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Só documentação |
| `refactor` | Refatoração sem mudar comportamento |
| `test` | Testes |
| `chore` | Manutenção (deps, config) |
| `style` | Formatação sem lógica |

Escopos sugeridos: `engine`, `catalogo`, `ui`, `docs`, `explicadora`, `ingestor`, `mental`, `deploy`, `ci`, `deps`.

### Boas práticas

- **Um commit = uma mudança lógica**
- Descrição no **imperativo**: "adicionar", "corrigir", "atualizar"
- Corpo opcional para o *porquê*
- Se a conversa mudar visão/prioridade, atualize `docs/mente.md` na mesma linha de trabalho

## Reverter com segurança

| Situação | Ação |
|----------|------|
| PR ainda aberta | Fechar PR ou fazer novos commits na branch |
| Já mergeada, mudança ruim | `git revert <sha>` numa branch + PR (não reescrever `main`) |
| Experimento descartável | Abandonar a branch; não mergear |
| Precisa pausar uma feature | Deixar a PR em draft |

## Arquivos que nunca devem ser commitados

- `.env`, `.env.local` e variantes com secrets
- `.next/`, `node_modules/`, `out/`, `build/`
- Credenciais (`*.pem`, tokens)

Use os `.env.example` como modelo.

## Checklist antes de abrir PR

- [ ] `npm test` (quando a mudança toca lógica testada)
- [ ] `npm run lint` / `npm run build` se mexeu na explicadora
- [ ] Commits seguem a convenção
- [ ] Branch atualizada com a base
- [ ] Nenhum secret
- [ ] `docs/mente.md` / roadmap atualizados se a mudança for estrutural

## Agentes (Cursor)

- Preferir branch `feature/*` ou `cursor/*` a partir da sprint ativa / `main`
- Commitar e dar push com frequência; abrir/atualizar PR
- Não expandir escopo sem pedido
- Em dúvida, documentar na mente e perguntar a prioridade ao usuário
