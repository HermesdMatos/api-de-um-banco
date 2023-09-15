const express = require('express');
const rotas = express.Router()

const { listarContas,
        criarContas,
        atualizarUsuario,
        excluirConta,
        depositar,
        sacar,
        transferir,
        listarSaldo,
        listarExtrato
} = require('../controllers/contabancaria')
const verificarSenha = require('../middlewares/intermediarios')




rotas.get('/contas', verificarSenha, listarContas)
rotas.post('/contas', criarContas)
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario)
rotas.delete('/contas/:numeroConta', excluirConta)
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)
rotas.get('/contas/saldo', listarSaldo)
rotas.get('/contas/extrato', listarExtrato)

module.exports = rotas;