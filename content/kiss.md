Title: [pt-BR] Keep it simple, stupid
Date: 2026-03-18 00:00
Category: Reflections


Há algum tempo, venho tentando me reconectar com o que me fez começar a gostar de computação.

Entre recuperar ThinkPads antigos e simplificar a minha computação pessoal, tornando-a mais local e autossuficiente, constatei que a minha página pessoal precisava seguir nesse mesmo rumo.

Originalmente, eu a havia programado usando dois frameworks: um JavaScript e um CSS. Um exagero muito grande, mas o resultado foi uma página razoavelmente bonita. No entanto, toda vez que eu precisava fazer alguma atualização, por mais insignificante que fosse, tinha um trabalho desproporcional. Alguma coisa sempre quebrava, ou por eu ter trocado de máquina ou de distro e o setup funcional já não existir mais, ou em virtude de eu simplesmente nem lembrar como alguma coisa funcionava em meio às várias camadas de abstração de uma estrutura bastante convoluída. Isso me levou a escrever com menos frequência, contrariando o principal propósito da página, que é justamente o de servir como blog.

Decidi buscar uma alternativa mais simples, que eu pudesse usar até mesmo em uma fresh install de Linux. Não que esse seja um requisito realista, mas ele ajuda a expressar a simplicidade que eu estava buscando. Ele me levou a descartar até mesmo o Jekyll.

Busquei alternativas em C e Bash e encontrei algumas opções, mas nenhuma me pareceu suficientemente robusta e, ao mesmo tempo, simples. Cogitei e, de fato, comecei a escrever a minha própria ferramenta em Bash, mas ao perceber que estava reincidindo em complexidade desnecessária, resolvi olhar para o que já existia em Python. Foi assim que eu descobri o [Pelican](https://getpelican.com/).

A documentação oficial prevê quatro passos simples para iniciar uma página estática. A estes, adicionei a criação preliminar de um venv e, poucos minutos depois, eu já estava com uma página de pé em localhost. Eu não poderia estar mais contente. O Pelican é simples, mas também não deixa a desejar em funcionalidade; atende ao meu requisito idealista de poder ser usado em uma fresh install de Linux sem instalação de pacotes adicionais, já que é escrito em Python; permite escrever em Markup; e, de quebra, ainda é licenciado pela [GNU AGPLv3](https://github.com/getpelican/pelican?tab=AGPL-3.0-1-ov-file) e, portanto, é software livre de primeira linha, em perfeita consonância com a proposta de autossuficiência. 

No momento da publicação da versão final deste artigo, a migração desta página para Pelican já estava consolidada. Estou certo de que essa mudança foi para melhor. O tema bare bones também é intencional. Esta página não se propõe a servir de vitrine, mas a agregar coisas interessantes. Eu espero que essa simplicidade premeditada me leve a escrever mais e que isso me sirva de lembrete daqui para a frente: _Keep it simple, stupid_!
