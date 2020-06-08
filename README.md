API desenvolvida em Node JS, com código escrito em Typescript

<p>Para execução do servidor é prciso a instalação de uma dependência de desenvolvimento:</p>

    $ npm install ts-node -D

<p>Para executar a aplicação, por estar escrita em Typescript, é preciso exectar o comando:</p>

    $ npx ts-node src/server.ts

Segue abaixo listagem das principais bibliotecas e dependencias utilizadas:

    - Typescript -> $ npm install typescript
    - Express -> $ npm install express
    - CORS ->  $ npm install cors
    - Axios -> $ npm install axios
    - DOTENV -> $ npm install dotenv
    - Mongoose -> $ npm install mongoose
    - Moment -> $ npm install moment
    - Morgan -> $ npm install morgan
    - XML Builder -> $ npm install xmlbuilder

<p>A rota para efetuar a integração entre Pipedrive e Bling é:</p>

    POST http://localhost:3333/integration

<p>Essa rota recupera as oportunidades com status igual a ganho no Pipedrive e depois insere como pedido na plataforma Bling</p>

<p>O sistema possui outras rotas para registrar um agragado de valor registrado por dia, e para recuperar esses dados, através de uma listagem de todas as agregações e também agregação por id</p>

    POST http://localhost:3333/aggregate

    Body:
    {
        date: "DD/MM/YYYY",
    }

    -------------------------------------

    GET http://localhost:3333/aggregate

    -------------------------------------

    http://localhost:3333/aggregate/:id

