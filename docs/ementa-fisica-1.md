# Ementa de Física 1 (rascunho para revisão)

Ementa **típica** montada a partir do Young & Freedman (*Física I — Mecânica*, 14ª ed.). Não é a ementa oficial da disciplina: o autor ajusta quando tiver a oficial. Ela orienta a trilha de estudo (`study-003` em diante).

Cada capítulo lista: o que se estuda, onde entra o cálculo, as armadilhas conceituais que o app deve atacar e os ganchos de lente (TFT e nanopartículas). O conteúdo formal é o mesmo em toda lente; só a pele muda (ver `personalizacao.md`).

Status: **rascunho, aguardando revisão do autor**.

## Mapa do semestre

| Bloco | Capítulos do livro | Semanas (aprox.) |
|-------|-------------------|------------------|
| 0. Ferramentas | 1 — Unidades, grandezas e vetores | 1–2 |
| 1. Cinemática | 2 — Movimento retilíneo; 3 — Movimento em 2D e 3D | 3–6 |
| 2. Dinâmica | 4 — Leis de Newton; 5 — Aplicações das leis de Newton | 7–10 |
| 3. Energia | 6 — Trabalho e energia cinética; 7 — Energia potencial e conservação | 11–14 |
| Opcional | 8 — Momento linear e colisões | 15–16 |

Muitas disciplinas de Física 1 também cobrem os capítulos 8 a 10 (momento, rotação, dinâmica rotacional). Ficam fora até o autor confirmar.

## Capítulo 1 — Unidades, grandezas físicas e vetores

- **Tópicos:** SI e conversão de unidades; algarismos significativos e estimativas (ordem de grandeza); vetores, componentes, vetor unitário; produto escalar e vetorial.
- **Cálculo:** ainda nenhum. Trigonometria para componentes.
- **Armadilhas:** somar módulos em vez de vetores; confundir componente com módulo; esquecer a unidade no meio da conta.
- **Lente TFT:** hexes como unidade de distância; deslocamento no tabuleiro como vetor.
- **Lente nanopartículas:** escala nanométrica (ordem de grandeza); razão superfície/volume ao diminuir o tamanho.

## Capítulo 2 — Movimento retilíneo (primeiro da trilha)

- **Tópicos:** posição, deslocamento, distância percorrida; velocidade média e instantânea; aceleração média e instantânea; movimento com aceleração constante; queda livre; velocidade e posição por integração.
- **Cálculo:**
  - velocidade instantânea como **limite** da velocidade média: \( v = \lim_{\Delta t \to 0} \frac{\Delta x}{\Delta t} = \frac{dx}{dt} \);
  - aceleração como **derivada** da velocidade: \( a = \frac{dv}{dt} = \frac{d^2x}{dt^2} \);
  - inclinação da reta tangente no gráfico \(x(t)\);
  - deslocamento como **integral** (área sob \(v(t)\)): \( \Delta x = \int_{t_1}^{t_2} v\,dt \);
  - dedução das equações de aceleração constante integrando \(a\).
- **Armadilhas:** deslocamento × distância percorrida; velocidade zero não implica aceleração zero (ponto mais alto da queda); aceleração negativa não significa "frear" sempre; usar equações de aceleração constante quando ela não é constante.
- **Cards existentes:** `vm_deslocamento_tempo`, `aceleracao_media`.
- **Lente TFT:** unidade andando por hexes e voltando ao mesmo hex (deslocamento zero, distância não).
- **Lente nanopartículas:** movimento browniano (deslocamento líquido pequeno, caminho longo).

## Capítulo 3 — Movimento em duas ou três dimensões

- **Tópicos:** vetores posição, velocidade e aceleração; movimento de projéteis; movimento circular (aceleração centrípeta); velocidade relativa.
- **Cálculo:** derivada de vetor componente a componente; aceleração centrípeta a partir da derivada da velocidade.
- **Armadilhas:** achar que a velocidade horizontal muda no projétil; achar que velocidade constante em módulo significa aceleração zero no movimento circular.
- **Lente TFT:** projéteis de ataque à distância; unidades girando em torno de um ponto.
- **Lente nanopartículas:** a definir com os artigos do autor.

## Capítulo 4 — Leis de Newton

- **Tópicos:** força e interações; 1ª lei (inércia, referenciais inerciais); 2ª lei (\( \sum \vec F = m\vec a \)); massa × peso; 3ª lei (pares ação-reação); diagrama de corpo livre.
- **Cálculo:** \( \vec F = m \frac{d\vec v}{dt} \) como ponte entre força e cinemática.
- **Armadilhas:** "movimento precisa de força" (aristotélico); pares ação-reação no mesmo corpo; confundir massa com peso; colocar \(m\vec a\) como uma força no diagrama.
- **Cards existentes:** `segunda_lei_newton`.
- **Lente TFT:** mesmo empurrão num carry leve e num tank pesado.
- **Lente nanopartículas:** a definir com os artigos do autor.

## Capítulo 5 — Aplicações das leis de Newton

- **Tópicos:** equilíbrio; dinâmica de partículas; atrito estático e cinético; arrasto e velocidade terminal; dinâmica do movimento circular.
- **Cálculo:** arrasto proporcional a \(v\) leva a uma **equação diferencial** simples; velocidade tendendo à terminal como limite \(t \to \infty\).
- **Armadilhas:** atrito estático sempre igual a \(\mu_s N\); normal sempre igual ao peso; "força centrífuga" como força real no referencial inercial.
- **Lente nanopartículas:** arrasto viscoso e velocidade terminal de partículas em fluido (gancho forte; precisa de fonte).

## Capítulo 6 — Trabalho e energia cinética

- **Tópicos:** trabalho de força constante; energia cinética; teorema trabalho-energia; trabalho de força variável; potência.
- **Cálculo:** trabalho como **integral**: \( W = \int_{x_1}^{x_2} F_x\,dx \) (área sob \(F(x)\)); potência como derivada: \( P = \frac{dW}{dt} \).
- **Armadilhas:** trabalho zero quando há força (força perpendicular ao deslocamento); trabalho negativo; confundir energia com força.

## Capítulo 7 — Energia potencial e conservação da energia

- **Tópicos:** energia potencial gravitacional e elástica; forças conservativas e não conservativas; conservação da energia mecânica; força como derivada da energia potencial; diagramas de energia.
- **Cálculo:** \( F_x = -\frac{dU}{dx} \); pontos de equilíbrio onde a derivada é zero (estável × instável pela concavidade).
- **Armadilhas:** energia potencial "pertence" a um corpo só; escolher o zero da energia potencial muda a física (não muda); energia mecânica sempre conservada.
- **Lente nanopartículas:** energia térmica × energia gravitacional em escala nano (por que nanopartículas não sedimentam fácil).

## Capítulo 8 (opcional) — Momento linear, impulso e colisões

- **Tópicos:** momento linear; impulso; conservação do momento; colisões elásticas e inelásticas; centro de massa.
- **Cálculo:** impulso como integral da força no tempo; \( \vec F = \frac{d\vec p}{dt} \).

## Ordem sugerida da trilha no app

1. Capítulo 2 completo (`study-003`), porque já existem cards e é onde limite, derivada e integral aparecem juntos.
2. Capítulo 1 só no que o capítulo 2 precisar (vetores em 1D, unidades).
3. Capítulos 3 → 4 → 5 → 6 → 7, um por vez.
