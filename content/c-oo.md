Title: [pt-BR] C orientado a objetos?
Date: 2026-03-22 12:00
Category: Programming


Recentemente, eu me deparei com [um e-mail escrito por Linus Torvalds em 2004](http://harmful.cat-v.org/software/c++/linus), em que ele tratava dos motivos pelos quais se posicionava diametralmente contra a introdução de C++ no kernel. Um trecho do e-mail, em especial, chamou a minha atenção. A certa altura, ele afirma, em estilo inconfundível:

> "you can write object-oriented code (useful for filesystems etc) in C, _without_ the crap that is C++."

C foi a primeira linguagem que eu aprendi formalmente e, possivelmente, a linguagem que eu estudei de maneira mais séria. No entanto, tendo sido introduzido à orientação a objetos (OO) em Java e, ainda, sem nunca ter usado linguagens procedurais para implementar código nesse paradigma de programação, mas tão somente tipos abstratos de dados sem necessariamente tentar respeitar encapsulamento, achei essa ideia bastante interessante e resolvi explorá-la, _Just for Fun_.

Em primeiro lugar, _o que é_ código orientado a objetos?

[Programação orientada a objetos](https://en.wikipedia.org/wiki/Object-oriented_programming) é um paradigma de programação construído em torno do conceito de objeto. Esse conceito se refere a uma entidade que agrupa tanto os dados quanto as operações que são aplicáveis a esses dados, sendo que a maneira como os dados e operações são agrupados respeita o conceito de [encapsulamento](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)). Por sua vez, esse conceito estabelece que somente código interno a um objeto pode manipular diretamente os dados desse objeto, e que código externo ao objeto só pode acessar dados e operações através de uma interface de programação exposta pelo objeto. O modelo mais popular de orientação a objetos é o [modelo baseado em classes](https://en.wikipedia.org/wiki/Class_(programming)). Esse é o modelo implementado em Java, por exemplo.

C é uma linguagem do paradigma procedural e, portanto, _não_ implementa OO por design. Entretanto, é possível utilizar estruturas da linguagem para implementar conceitos desse paradigma de programação. Possivelmente, a maneira mais fácil de iniciar a exploração dessa ideia é pelos dados. Em OO, os dados de um objeto são denominados atributos. É perfeitamente possível fazer um paralelo entre um objeto e os seus atributos em OO e um `struct` e as suas variáveis em C. O trecho de código a seguir ilustra isso:

```c
struct
{
    float width, height;
};
```

O `struct` contém duas variáveis, `width` e `height`, do tipo `float`, cujo propósito é armazenar valores de largura e altura, respectivamente. Podemos utilizar esse `struct` para definir o tipo `Rectangle`:

```c
typedef struct Rectangle Rectangle;
struct Rectangle
{
    float width, height;
};
```

O próximo passo natural é adicionar setters e getters a `Rectangle`. A solução aqui é utilizar ponteiros para funções:

```c
typedef struct Rectangle Rectangle;
struct Rectangle
{
    float width, height;

    float (*getWidth)(Rectangle *self);
    void (*setWidth)(Rectangle *self, float width);
    float (*getHeight)(Rectangle *self);
    void (*setHeight)(Rectangle *self, float height);
};
```

A essa altura, adicionar uma função principal já seria suficiente para compilar um programa com `Rectangle`, mas ainda há elementos importantes a endereçar. Um dos próximos passos óbvios é implementar os setters e getters. Esses métodos são definidos fora do `struct`:

```c
float getWidth(Rectangle *self)
{
    return self->width;
}

void setWidth(Rectangle *self, float width)
{
    self->width = width;
}

float getHeight(Rectangle *self)
{
    return self->height;
}

void setHeight(Rectangle *self, float height)
{
    self->height = height;
}
```

Por fim, precisamos implementar um construtor. O construtor de `Rectangle` precisa receber os valores de `width` e `height`, alocar memória para `Rectangle` (é necessário incluir `stdlib.h`) e atribuir os endereços dos métodos acima aos respectivos ponteiros:

```c
Rectangle* construct(float width, float height)
{
    Rectangle *rectangle = (Rectangle*) malloc(sizeof(Rectangle));
    rectangle->width = width;
    rectangle->height = height;
    rectangle->getWidth = getWidth;
    rectangle->setWidth = setWidth;
    rectangle->getHeight = getHeight;
    rectangle->setHeight = setHeight;
    return rectangle;
}
```

Com isso, já temos recursos suficientes para criar uma instância de `Rectangle` e realizar algumas operações simples. Podemos incluir `stdio.h` e colocar o código abaixo na função principal para criar um belíssimo retângulo respeitando aproximadamente a proporção áurea e, em seguida, inspecionar as suas dimensões:

```c
int main()
{
    Rectangle *rectangle = construct(1.6180, 1.0);
    printf("Rectangle:\n");
    printf("Width: %f\n", rectangle->getWidth(rectangle)); 
    printf("Height: %f\n", rectangle->getHeight(rectangle));
    return 0;
}
```

O código acima gera a seguinte saída:

```bash
Rectangle:
Width: 1.618000
Height: 1.000000
```

Podemos incrementar a nossa implementação de `Rectangle` adicionando métodos para calcular área e perímetro, de forma a obter a versão final do código dessa prova de conceito: 

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Rectangle Rectangle;
struct Rectangle
{
    float width, height;

    float (*getArea)(Rectangle *self);
    float (*getPerimeter)(Rectangle *self);
    float (*getWidth)(Rectangle *self);
    void (*setWidth)(Rectangle *self, float width);
    float (*getHeight)(Rectangle *self);
    void (*setHeight)(Rectangle *self, float height);
};

float getArea(Rectangle *self)
{
    return self->width * self->height;
}

float getPerimeter(Rectangle *self)
{
    return (2 * self->width) + (2 * self->height);
}

float getWidth(Rectangle *self)
{
    return self->width;
}

void setWidth(Rectangle *self, float width)
{
    self->width = width;
}

float getHeight(Rectangle *self)
{
    return self->height;
}

void setHeight(Rectangle *self, float height)
{
    self->height = height;
}

Rectangle* construct(float width, float height)
{
    Rectangle *rectangle = (Rectangle*) malloc(sizeof(Rectangle));
    rectangle->width = width;
    rectangle->height = height;
    rectangle->getArea = getArea;
    rectangle->getPerimeter = getPerimeter;
    rectangle->getWidth = getWidth;
    rectangle->setWidth = setWidth;
    rectangle->getHeight = getHeight;
    rectangle->setHeight = setHeight;
    return rectangle;
}

int main()
{
    Rectangle *rectangle = construct(1.6180, 1.0);
    printf("Rectangle:\n");
    printf("Width: %f\n", rectangle->getWidth(rectangle)); 
    printf("Height: %f\n", rectangle->getHeight(rectangle));
    printf("Area: %f\n", rectangle->getArea(rectangle));
    printf("Perimeter: %f\n", rectangle->getPerimeter(rectangle)); 
    return 0;
}
```

O código acima gera a seguinte saída: 

```c
Rectangle:
Width: 1.618000
Height: 1.000000
Area: 1.618000
Perimeter: 5.236000
```

Possivelmente, há maneiras melhores de codificar diversos dos conceitos de OO que o programa acima se propõe a implementar. Particularmente, a necessidade de passar `self` a todos os métodos me incomoda bastante, por ser uma clara violação de encapsulamento. Além disso, alguns elementos importantes, como herança e polimorfismo, nem sequer foram endereçados aqui. Apesar dessas claras limitações e de a linguagem não ter sido projetada para orientação a objetos, nota-se que é perfeitamente factível implementar código OO em C.

Entretanto, qual é a viabilidade disso? Eu não diria que é inviável utilizar elementos de OO, com a devida parcimônia, em programas C. Pelo contrário, a implementação de conceitos de OO pode ser particularmente interessante em alguns contextos, como no desenvolvimento de APIs, por exemplo, mas é preciso levar em consideração que a linguagem simplesmente não foi desenvolvida para isso, e abusar do uso desses recursos de forma a torná-los predominantes me parece uma decisão de projeto no mínimo arriscada, além de um indicativo de que C pode nem ser a escolha de tecnologia mais adequada, caso essa predominância tenha origem na observação de real necessidade.

Por outro lado, que explorar essa possibilidade é divertido, isso é. Além disso, com esse exercício rápido, percebi que implementar conceitos de OO em uma linguagem procedural pode ser muito interessante do ponto de vista de procurar entender como se dá a construção de linguagens primariamente orientadas a objetos e os desafios associados à implementação desse paradigma.
