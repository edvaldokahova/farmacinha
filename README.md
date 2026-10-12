# Farmacinha da Mamã — quiz + página de venda (GitHub + Vercel)

## Publicar
1. Crie um repositório no GitHub e envie **todo o conteúdo desta pasta** (não a pasta em si).
2. No Vercel: New Project → importe o repositório → Framework: **Other** → Deploy.
3. Ligue o domínio, se tiver.

## Onde editar
- `config.js` — pixel, link de checkout, preço, WhatsApp, provas sociais e nº de clientes.
- Imagens em `img/`. Para trocar uma foto, substitua o ficheiro com o **mesmo nome**.

## Provas sociais (prints reais)
1. Guarde os prints em **`img/provas/`** (ex.: `prova1.jpg`, `prova2.jpg`).
2. Em `config.js`: `provas: ['prova1.jpg', 'prova2.jpg']`.
3. Aparecem no ecrã "A analisar as suas respostas" (até 3) e na secção "O que dizem as mães".
Só prints verdadeiros, de clientes que autorizaram. Sem prints, as secções ficam escondidas.

## Link directo para a oferta (sem quiz)
`https://SEU-DOMINIO/#oferta`

## Pixel (1674334114620463)
PageView (todas as páginas) · ViewContent (quando a oferta aparece) · InitiateCheckout (clique no botão de compra, 6900 AOA) · Contact (WhatsApp).
As respostas do quiz **não** são enviadas ao Pixel. Os UTM do anúncio são passados para o checkout.
