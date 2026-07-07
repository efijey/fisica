# Padrões de Git — Projeto Física

Este documento define como trabalhamos com branches e commits neste repositório. Ele serve como referência para humanos e para agentes de IA que colaboram no projeto.

## Modelo de branches

Usamos um **Git Flow simplificado orientado a sprints**:

| Tipo | Padrão | Exemplo | Base | Uso |
|------|--------|---------|------|-----|
| Principal | `main` | `main` | — | Código estável, pronto para deploy |
| Sprint | `sprint-N` | `sprint-1` | `main` | Trabalho concentrado de uma sprint |
| Feature | `feature/<descricao-curta>` | `feature/calculo-numerico` | `sprint-N` | Funcionalidade isolada dentro da sprint |
| Hotfix | `hotfix/<descricao-curta>` | `hotfix/catalogo-bug` | `main` | Correção urgente fora do ciclo de sprint |

### Regras

1. **`main` sempre deve compilar** — não fazer push direto de código quebrado.
2. **Trabalho diário acontece em `sprint-N`** ou em branches `feature/*` derivadas dela.
3. **Ao final da sprint**, abrir Pull Request de `sprint-N` → `main` e fazer merge após revisão.
4. **Hotfixes** partem de `main`, são corrigidos e mergeados de volta em `main` e na sprint ativa (se existir).
5. **Nunca usar espaços** em nomes de branch — use hífens (`sprint-1`, não `sprint 1`).

### Fluxo típico

```
main
 └── sprint-1
      ├── feature/calculo-numerico
      └── feature/testes-engine
```

```bash
# Iniciar trabalho em uma feature
git checkout sprint-1
git pull origin sprint-1
git checkout -b feature/minha-feature

# Finalizar feature
git push -u origin feature/minha-feature
# Abrir PR: feature/minha-feature → sprint-1
```

## Convenção de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo opcional>): <descrição curta em português>

Corpo opcional com contexto adicional.
```

### Tipos permitidos

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `refactor` | Refatoração sem mudar comportamento |
| `test` | Adicionar ou corrigir testes |
| `chore` | Tarefas de manutenção (deps, config) |
| `style` | Formatação, sem mudança de lógica |

### Escopos sugeridos

`engine`, `catalogo`, `ui`, `docs`, `readme`, `deps`, `test`

### Exemplos

```
feat(engine): adicionar cálculo numérico nas fórmulas inferidas

fix(catalogo): corrigir campo expressaoPrincipal no CatalogoFormulas

docs(readme): documentar setup e arquitetura do projeto

test(engine): cobrir inferirFormulas com casos de borda

chore(deps): atualizar next para 16.2.10
```

### Boas práticas

- **Um commit = uma mudança lógica** — evite commits gigantes misturando docs, refactor e feature.
- **Descrição no imperativo** — "adicionar", "corrigir", "atualizar" (não "adicionado" ou "adicionando").
- **Corpo opcional** — use quando o *porquê* não couber na linha de assunto.

## Arquivos que nunca devem ser commitados

- `.env` e variantes (`.env.local`, etc.)
- `.next/`, `node_modules/`, `out/`, `build/`
- `.idea/` (configuração de IDE)
- Arquivos de credenciais (`*.pem`, tokens)

## Checklist antes de abrir PR

- [ ] Código compila (`npm run build`)
- [ ] Lint passa (`npm run lint`)
- [ ] Commits seguem a convenção acima
- [ ] Branch está atualizada com a base (`sprint-N` ou `main`)
- [ ] Nenhum arquivo sensível incluído
