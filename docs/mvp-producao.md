# Checklist — MVP em produção (demo)

Objetivo: colocar a **explicadora** no ar para apresentar a ideia (ex.: professora), com risco baixo e rollback fácil.

## Escopo do MVP público

**Inclui**
- Site da `apps/explicadora` acessível por URL HTTPS
- Abas Inferência, Explorar, Catálogo, Gráficos, Problemas
- Funcionamento sem `OPENAI_API_KEY` (modo mock na mesa mental)
- README / mente atualizados com a URL quando existir

**Fora do MVP público (por enquanto)**
- Ingestor em produção (pode ficar só local)
- Login de alunos
- Cálculo numérico completo
- CI perfeito / observabilidade avançada (mínimo já ajuda)

## Checklist técnico

### Antes do primeiro deploy

- [ ] `npm test` verde
- [ ] `npm run lint` verde (explicadora)
- [ ] `npm run build` verde (explicadora)
- [ ] Confirmar que Problemas funciona sem OpenAI
- [ ] Revisar textos da home (título, subtítulo) para a demo
- [ ] Criar branch `sprint-4` a partir de `main` quando a sprint começar

### Deploy (Vercel sugerido)

- [ ] Projeto Vercel apontando para o monorepo
- [ ] Root / app: `apps/explicadora`
- [ ] Build: `npm run build` (workspace) ou comando equivalente do app
- [ ] Env: `OPENAI_API_KEY` opcional (só se quiser LLM real na demo)
- [ ] Domínio / URL anotada em `docs/mente.md` e README

### Qualidade mínima

- [ ] CI no GitHub: lint + test + build em PR (issue #4)
- [ ] Branch protection leve em `main` (opcional, mas ajuda)
- [ ] Tag ou release `v0.1.0-mvp` após demo estável

### Roteiro de apresentação (5–10 min)

1. Abrir **Explorar** — mostrar que aceleração aparece em vários contextos
2. Abrir **Inferência** — selecionar variáveis e ver fórmula sugerida
3. Abrir **Problemas** — explicar raciocínio; mostrar feedback do juiz
4. (Opcional) Mesa mental / voz se a chave OpenAI estiver configurada
5. Fechar com: o app ensina o *porquê*, não só o número

## Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| LLM fora / cara | Demo sem chave (mock) |
| Build quebra no monorepo | Validar `npm run build` local antes do push |
| Escopo cresce demais | Só mergear o que serve à demo |
| Precisa reverter | Feature branch + PR; `git revert` no merge se necessário |

## Definição de “pronto para apresentar”

1. URL pública abre a explicadora
2. Três fluxos principais (Inferência, Explorar, Problemas) usáveis no celular e no desktop
3. Nada de tela de erro óbvia no caminho feliz
4. Dá para explicar a visão do produto em uma frase
