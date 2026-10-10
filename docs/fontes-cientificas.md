# Fontes científicas — como ancoramos a física

Objetivo: a **criatividade** fica na pele (TFT, LoL, etc.); o **conceito** vem de literatura rastreável.

## Princípio

```
trecho canônico (livro / material citado)
        +
esqueleto (formulaId / variável no physics-core)
        +
mundo do interesse (só narrativa e entidades)
        ↓
exercício / explicação personalizada
        +
citação visível na UI
```

A API **não** pode inventar a física. O prompt recebe o trecho e a obrigação de citar a fonte. Se não houver trecho para o conceito, **não geramos** (ou usamos só fallback neutro já revisado).

## Paciente zero (o que fazemos agora)

Não precisamos de RAG completo nem de indexar PDF inteiro para validar a ideia.

1. **Cards de literatura** no código (`literatura/cards.ts`): um conceito → trecho curto + metadados da obra.  
2. Você cola trechos dos **seus PDFs** nesses cards (ou em arquivos em `literatura/trechos/`).  
3. Na geração, o modelo só pode apoiar afirmações científicas nesse trecho + no esqueleto do `physics-core`.  
4. A UI mostra a **referência** (obra, capítulo/seção quando houver).

Isso é deliberadamente simples: construir / destruir rápido, sem login multi-usuário.

## Por que não jogar o PDF inteiro no ChatGPT?

| Abordagem | Quando faz sentido | Risco |
|-----------|--------------------|--------|
| Card + trecho citado (agora) | Paciente zero, controle alto | Trabalho manual de colar trechos |
| Site na hora da geração | Rápido, mas frágil | Conteúdo muda; difícil auditar; alucinação |
| RAG sobre PDFs (depois) | Escalar trechos | Setup (parse, chunks, embeddings); direitos autorais do texto integral |

**Recomendação:** comece pelos cards. Se der certo com você, aí sim pensamos em pipeline de PDF → trechos no banco.

## Direitos autorais (importante)

- **Não** versionar PDF completo de livro comercial no GitHub.  
- Pode versionar **trechos curtos** para estudo + metadados da citação (obra, autores, edição, páginas), no espírito de citação acadêmica.  
- Para seed inicial usamos também material **aberto** (ex.: OpenStax, CC BY) até você substituir pelos seus livros.

## Como você alimenta uma fonte

1. Abra o PDF no conceito (ex.: velocidade média).  
2. Copie 2–6 frases que definem o conceito com rigor.  
3. Preencha/edite um card em  
   `apps/explicadora/app/physics/personalizado/literatura/cards.ts`  
   (campos: `obra`, `autores`, `trecho`, `formulaIds`, etc.).  
4. Gere de novo o exercício no mundo TFT/LoL — a citação deve aparecer na tela.

## Depois (só se a Fase 0 agradar)

- Tabela Supabase `literature_excerpts` + upload de trechos  
- Opcional: embeddings para achar o trecho certo automaticamente  
- Ingestora como estúdio: revisar gerado + promover ao pool do interesse  

Até lá: **fonte no card · pele no mundo · resultado no localStorage (só você)**.
