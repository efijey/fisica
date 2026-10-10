import type { Capitulo } from "./tipos"

const r = String.raw

export const capitulo1: Capitulo = {
  numero: 1,
  titulo: "Unidades, grandezas físicas e vetores",
  resumo:
    "As ferramentas que o resto do semestre usa: medir com unidades, saber o tamanho aproximado das coisas e descrever grandezas que têm direção.",
  secoes: [
    {
      id: "grandezas-unidades",
      titulo: "Grandezas físicas e unidades",
      referencia: "Young & Freedman, seção 1.3",
      intuicao:
        "Dizer que uma mesa mede “2” não informa nada: 2 o quê? Toda medida em física é um número acompanhado de uma unidade, que diz com qual padrão você comparou.",
      definicao: r`Uma grandeza física é algo que se mede: comprimento, tempo, massa. O Sistema Internacional (SI) usa três unidades de base na mecânica: o metro (\(\mathrm{m}\)) para comprimento, o segundo (\(\mathrm{s}\)) para tempo e o quilograma (\(\mathrm{kg}\)) para massa. As outras unidades da mecânica são combinações delas; velocidade, por exemplo, sai em \(\mathrm{m/s}\). Prefixos indicam potências de 10: quilo \(= 10^{3}\), mili \(= 10^{-3}\), micro \(= 10^{-6}\), nano \(= 10^{-9}\).`,
      porque:
        "Unidades padronizadas permitem comparar medidas feitas por pessoas diferentes. E viram uma ferramenta de checagem: uma equação só pode estar certa se os dois lados tiverem a mesma unidade (consistência dimensional).",
      armadilhas: [
        r`Somar grandezas de tipos diferentes: \(3\ \mathrm{m} + 2\ \mathrm{s}\) não tem sentido.`,
        "Tratar o quilograma como unidade de peso. Quilograma mede massa; peso é uma força (capítulo 4).",
      ],
      exemplo: {
        enunciado: r`A equação \(x = v\,t^2\) pode estar certa, sendo \(x\) uma posição, \(v\) uma velocidade e \(t\) um tempo?`,
        resolucao: r`Do lado esquerdo há metros. Do lado direito, \(\mathrm{\tfrac{m}{s}} \cdot \mathrm{s}^2 = \mathrm{m \cdot s}\). As unidades não batem, então a equação está errada, sem precisar de nenhuma medida.`,
      },
    },
    {
      id: "conversao",
      titulo: "Conversão de unidades",
      referencia: "Young & Freedman, seção 1.4",
      intuicao:
        "Trocar de unidade não muda o tamanho da coisa, só a régua. Uma estrada de 1 km continua do mesmo tamanho quando você diz 1000 m.",
      definicao: r`Para converter, multiplica-se por uma fração que vale 1, com a unidade nova em cima e a antiga embaixo: \[ \frac{1000\ \mathrm{m}}{1\ \mathrm{km}} = 1 \] As unidades se cancelam como se fossem números.`,
      porque:
        "Multiplicar por 1 não muda a grandeza. E o cancelamento das unidades mostra se a fração foi montada do lado certo: se a unidade antiga não some, a fração está de cabeça para baixo.",
      armadilhas: [
        r`Converter área ou volume com o fator do comprimento: \(1\ \mathrm{m}^2 = (100\ \mathrm{cm})^2 = 10^{4}\ \mathrm{cm}^2\), e não \(100\ \mathrm{cm}^2\).`,
        "Montar a fração invertida e não conferir se as unidades se cancelaram.",
      ],
      exemplo: {
        enunciado: r`Converter \(72\ \mathrm{km/h}\) para \(\mathrm{m/s}\).`,
        resolucao: r`Uma fração para trocar quilômetros por metros, outra para trocar horas por segundos: \[ 72\ \frac{\mathrm{km}}{\mathrm{h}} \cdot \frac{1000\ \mathrm{m}}{1\ \mathrm{km}} \cdot \frac{1\ \mathrm{h}}{3600\ \mathrm{s}} = 20\ \frac{\mathrm{m}}{\mathrm{s}} \] Os quilômetros e as horas se cancelam; sobra \(\mathrm{m/s}\).`,
      },
    },
    {
      id: "algarismos-significativos",
      titulo: "Incerteza e algarismos significativos",
      referencia: "Young & Freedman, seção 1.5",
      intuicao:
        "Uma régua escolar não distingue décimos de milímetro. Escrever mais casas do que o instrumento mede é inventar informação.",
      definicao:
        "Toda medida tem incerteza. Algarismos significativos são os dígitos que de fato foram medidos, incluindo o último, que é duvidoso. Em multiplicação e divisão, o resultado fica com o menor número de algarismos significativos entre os fatores. Em soma e subtração, vale a menor quantidade de casas decimais.",
      porque:
        "O resultado de uma conta não pode ser mais preciso que os dados que entraram nela.",
      armadilhas: [
        "Copiar todos os dígitos da calculadora.",
        r`Contar zeros à esquerda: \(0{,}0032\) tem só dois algarismos significativos.`,
      ],
      exemplo: {
        enunciado: r`Uma sala mede \(4{,}2\ \mathrm{m}\) por \(3{,}56\ \mathrm{m}\). Com quantos algarismos a área deve ser escrita?`,
        resolucao: r`O primeiro fator tem 2 algarismos significativos e o segundo tem 3, então a área fica com 2. A calculadora mostra \(14{,}952\), mas o resultado honesto é \(15\ \mathrm{m}^2\).`,
      },
    },
    {
      id: "ordem-de-grandeza",
      titulo: "Estimativas e ordens de grandeza",
      referencia: "Young & Freedman, seção 1.6",
      intuicao:
        "Antes de calcular com precisão, vale saber o tamanho aproximado da resposta. É isso que permite perceber quando um resultado está absurdo.",
      definicao:
        "A ordem de grandeza de um número é a potência de 10 mais próxima dele. Uma estimativa usa valores arredondados e raciocínio simples para chegar a essa potência.",
      porque: r`A física trabalha de escalas atômicas (\(10^{-10}\ \mathrm{m}\)) a astronômicas (\(10^{20}\ \mathrm{m}\) e além). Comparar potências de 10 mostra o que importa num problema e o que pode ser desprezado.`,
      armadilhas: [
        "Gastar tempo com precisão em dados que você mesmo arredondou.",
        "Achar que estimativa é chute sem valor. Errar por um fator 2 raramente muda a conclusão; errar por um fator 1000 muda.",
      ],
      exemplo: {
        enunciado: "Quantas vezes um coração bate ao longo de uma vida?",
        resolucao: r`Cerca de 1 batida por segundo; um ano tem uns \(3 \times 10^{7}\ \mathrm{s}\); uma vida, uns 80 anos: \[ 1 \cdot (3 \times 10^{7}) \cdot 80 \approx 2 \times 10^{9} \] Ordem de grandeza: \(10^{9}\) batidas.`,
      },
    },
    {
      id: "vetores",
      titulo: "Vetores e soma vetorial",
      referencia: "Young & Freedman, seção 1.7",
      intuicao:
        "Andar 3 quarteirões não diz onde você chegou: depende de para onde andou. Grandezas assim precisam de tamanho e direção.",
      definicao: r`Grandeza escalar tem só valor (massa, tempo, temperatura). Grandeza vetorial tem módulo, direção e sentido (deslocamento, velocidade, força). Escreve-se \(\vec{A}\), e o módulo é \(A = |\vec{A}|\). Somar vetores é colocar o início de um na ponta do outro: \(\vec{R} = \vec{A} + \vec{B}\) vai do início do primeiro até a ponta do último.`,
      porque:
        "Dois deslocamentos de 3 m podem resultar em qualquer coisa entre 0 e 6 m, conforme as direções. Só a soma vetorial captura isso.",
      armadilhas: [
        r`Somar os módulos: em geral \(|\vec{A} + \vec{B}| \neq A + B\).`,
        r`Achar que \(-\vec{A}\) é um vetor menor. Ele tem o mesmo módulo, com sentido oposto.`,
      ],
      exemplo: {
        enunciado:
          "Você anda 3 m para leste e depois 4 m para norte. Qual é o seu deslocamento?",
        resolucao: r`Os dois vetores formam os catetos de um triângulo retângulo: \[ R = \sqrt{(3\ \mathrm{m})^2 + (4\ \mathrm{m})^2} = 5\ \mathrm{m} \] Você andou 7 m no total, mas está a 5 m do ponto de partida. Essa diferença entre distância percorrida e deslocamento volta no capítulo 2.`,
      },
    },
    {
      id: "componentes",
      titulo: "Componentes de vetores",
      referencia: "Young & Freedman, seção 1.8",
      intuicao: r`Desenhar setas funciona para dois vetores. Com muitos, é mais fácil quebrar cada vetor em “quanto anda em \(x\)” e “quanto anda em \(y\)” e somar números.`,
      definicao: r`Um vetor de módulo \(A\) que faz ângulo \(\theta\) com o eixo \(x\) positivo tem componentes \[ A_x = A\cos\theta, \qquad A_y = A\operatorname{sen}\theta \] e, no caminho de volta, \[ A = \sqrt{A_x^2 + A_y^2}, \qquad \tan\theta = \frac{A_y}{A_x} \] Para somar vetores, somam-se as componentes: \(R_x = A_x + B_x\) e \(R_y = A_y + B_y\).`,
      porque: r`Os eixos são independentes: o que acontece em \(x\) não interfere em \(y\). Essa ideia volta no movimento de projéteis (capítulo 3).`,
      armadilhas: [
        r`Trocar \(\cos\) e \(\operatorname{sen}\) quando o ângulo é medido a partir do eixo \(y\), e não do \(x\).`,
        r`Confiar cegamente no \(\arctan\) da calculadora: ela não sabe em que quadrante o vetor está.`,
      ],
      exemplo: {
        enunciado: r`Um vetor tem \(A_x = -3\) e \(A_y = -3\). A calculadora dá \(\arctan(1) = 45^\circ\). Esse é o ângulo do vetor?`,
        resolucao: r`Não. As duas componentes são negativas, então o vetor aponta para o terceiro quadrante: o ângulo é \(45^\circ + 180^\circ = 225^\circ\).`,
      },
    },
    {
      id: "vetores-unitarios",
      titulo: "Vetores unitários",
      referencia: "Young & Freedman, seção 1.9",
      intuicao:
        "Um vetor unitário é uma seta de tamanho 1 que só diz “para onde”. Multiplicando por um número, você diz “quanto”.",
      definicao: r`Os vetores \(\hat{\imath}\), \(\hat{\jmath}\) e \(\hat{k}\) têm módulo 1 e apontam nos sentidos positivos de \(x\), \(y\) e \(z\). Qualquer vetor se escreve como \[ \vec{A} = A_x\,\hat{\imath} + A_y\,\hat{\jmath} + A_z\,\hat{k} \]`,
      porque:
        "Essa notação junta módulo e direção numa linha só e transforma a soma de vetores em soma de números, eixo por eixo.",
      armadilhas: [
        r`Dar unidade ao vetor unitário. Ele não tem unidade; ela fica na componente, como em \((3\ \mathrm{m})\,\hat{\imath}\).`,
      ],
    },
    {
      id: "produtos",
      titulo: "Produtos de vetores",
      referencia: "Young & Freedman, seção 1.10",
      intuicao:
        "Há duas perguntas úteis sobre dois vetores: quanto um aponta na direção do outro, e quanto os dois “abrem” um plano entre si. Cada pergunta tem o seu produto.",
      definicao: r`O produto escalar dá um número: \[ \vec{A} \cdot \vec{B} = AB\cos\phi = A_xB_x + A_yB_y + A_zB_z \] O produto vetorial dá um vetor perpendicular aos dois, com módulo \[ |\vec{A} \times \vec{B}| = AB\operatorname{sen}\phi \] e sentido dado pela regra da mão direita. Aqui \(\phi\) é o ângulo entre os vetores.`,
      porque:
        "O produto escalar aparece no trabalho de uma força (capítulo 6): só a parte da força na direção do movimento realiza trabalho. O produto vetorial aparece em torque e rotação.",
      armadilhas: [
        r`Achar que a ordem não importa no produto vetorial: \(\vec{B} \times \vec{A} = -\,\vec{A} \times \vec{B}\).`,
        "Esquecer que o produto escalar de vetores perpendiculares é zero, por maiores que eles sejam.",
      ],
    },
  ],
}
