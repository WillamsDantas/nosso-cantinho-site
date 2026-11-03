# Nosso Cantinho Comedoria · site

Site de página única da Nosso Cantinho: comida de casa, tempero do Nordeste.
HTML, CSS e JavaScript puros, sem dependências. Funciona no GitHub Pages.

## Estrutura

```
index.html            página
css/style.css         estilos (cores e fontes da marca)
js/main.js            dados de contato, horários e cardápio
cardapio.pdf          cardápio A4 frente e verso (botão "Baixar cardápio completo")
favicon.svg           símbolo da marca
assets/fonts/         Amatic SC e Manrope (hospedadas no próprio site)
assets/img/marca/     logo, símbolo e vapor em SVG
assets/img/mockups/   mockups usados na história e no Instagram
assets/img/fotos/     fotos de comida (coloque aqui)
```

## Dados do restaurante

Tudo fica no bloco `CONFIG`, no início de `js/main.js`: WhatsApp, telefone, Instagram, link do iFood, endereço, busca do mapa e horários.
O selo "Aberto agora / Fechado agora" é calculado sozinho pelo horário de Maceió.

O cardápio fica na lista `CARDAPIO`, no mesmo arquivo. Para mudar um prato ou preço, edite a linha correspondente.

Os depoimentos estão em `index.html`, na seção `#depoimentos`. Use só avaliações reais, com autorização do cliente.

## Fotos de comida

Enquanto não houver foto, cada espaço mostra um quadro com o vapor e a descrição da foto esperada.
Para colocar a foto, salve o arquivo em `assets/img/fotos/` com o nome exato abaixo. A foto aparece sozinha, sem mexer no código.

| Arquivo | Onde aparece | Formato |
|---|---|---|
| `hero-moqueca.jpg` | Abertura | 4:5 |
| `pilar-caseira.jpg` | Cartão Comida caseira | 3:2 |
| `pilar-frutos-do-mar.jpg` | Cartão Frutos do mar | 3:2 |
| `pilar-caipirosca.jpg` | Cartão Caipirosca | 3:2 |
| `combo-da-casa.jpg` | Sugestão da casa | 6:5 |
| `prato-<nome-do-prato>.jpg` | Miniatura de cada prato do cardápio | 1:1 |

Exemplos de nomes das miniaturas: `prato-galinha-caipira-ao-molho.jpg`, `prato-carne-de-sol-na-nata.jpg`, `prato-escondidinho-de-charque.jpg`, `prato-feijoada-nordestina.jpg`, `prato-prato-do-dia.jpg`, `prato-caldinho-de-sururu.jpg`, `prato-moqueca-de-camarao.jpg`.
A regra é: `prato-` + nome do prato em minúsculas, sem acentos, com hífens no lugar dos espaços.
Prato sem foto continua com o ícone de vapor.

Use JPG com até 1600 px no lado maior e qualidade em torno de 80% para o site carregar rápido.

## Publicar no GitHub Pages

1. No repositório, abra **Settings › Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Selecione a branch **main** e a pasta **/ (root)** e salve.
4. Em um ou dois minutos o site fica no ar em `https://<usuario>.github.io/nosso-cantinho-site/`.
