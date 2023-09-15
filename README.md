### API de um Banco Digital

Inicialmente ela traz algumas funcionalidades para realizar as operações de um banco digital, como:
- Criar um conta;
- atualizar uma conta;
- Deletar uma conta;
- Depositar;
- Sacar;
- Transferir;

### Contexto:
- O banco digital precisa de um API para ser acessado por um cliente.
- O cliente precisa de um API para criar uma conta, atualizar uma conta, deletar uma conta, depositar, sacar e transferir.

### Uso Básico:
A pode ser utilizada para criar uma conta, atualizar uma conta, deletar uma conta, depositar, sacar e transferir.

Segue alguns exemplos de solicitações e respostas HTTP:
- A chamada inicial é feita pelo cliente (GET) /contas', que retorna uma lista de contas.

- Um cliente (POST) /contas', que cria uma nova conta, e retorna a conta criada.

- Um cliente (PUT) /contas/:numeroConta/usuario, que atualiza uma conta, e retorna a conta atualizada.

- Um cliente (DELETE) /contas/:numeroConta, que deleta uma conta.


- Um cliente (POST) /transacoes/depositar
que deposita um valor em uma conta.

- Um cliente (POST) /transacoes/sacar
que saca um valor em uma conta.


- Um cliente (POST) /transacoes/transferir
que transfere um valor em uma conta para outra conta.


- Clientes (GET) /contas/saldo e /contas/extrato para obter o saldo e o extrato de uma conta.

![Alt text](image.png)


### Pre-requisitos
- [node](https://nodejs.org/) versão 16.13.2.

### tecnologias
- [Express](https://expressjs.com/pt-br/)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [date-fns](https://date-fns.org/)
- [insomnia](https://insomnia.rest/)
- [javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

### Testes
Testes feitos com a ferramenta **Insomnia**

### Preparação:

````
git clone https://github.com/HermesdMatos/api-de-um-banco.git

cd API-de-Banco

npm install
```````
### Run 

````
npm run dev
````
