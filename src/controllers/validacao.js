const { contas } = require('../data/bancodedados');

const validar = {
    dados: (req) => {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

        if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
            return false
        }
        return true
    },
    cpf_email: (req) => {
        const cpf_EmailExistente = contas.find(
            conta => conta.usuario.cpf === req.body.cpf
                || conta.usuario.email === req.body.email);
        
        if (cpf_EmailExistente) {
            return false
            }
        return true
    }, 

    numeroConta: (req) => {
        const numero = contas.find(conta => conta.numero === req.params.numeroConta);
        if (!numero) {
            return false
        }
            return true
    },
    numero_conta_senha: (req) => {
        if (!req.query.numero_conta || !req.query.senha) {
            return false
        }
            return true
    }, 

    numero_valor: (req, res) => {
        if (!req.body.numero_conta || !req.body.valor) {
            return false
        }
        return true
    },
    contaExistente: (req, res) => {
        const conta = contas.some(conta => conta.numero === req.body.numero_conta);
        return conta
    },
    valor: (req, res) => {
        const validar = Number(req.body.valor) <= 0 ? false : true;
        return validar
    },
    numero_valor_senha: (req, res) => {
        const { numero_conta, valor, senha } = req.body;
        if (!numero_conta || !valor || !senha) {
            return false
        }
        return true
    },
    numeroContas_valor_senha: (req, res) => {
        const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

        if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
            return false
        }
        return true
    },
    senha: (req, res) => {
        const senhaCorreta = contas.some((conta) => {
            return conta.usuario.senha === req.body.senha && conta.numero === req.body.numero_conta;
        });
        return senhaCorreta
    },
    saldo: (req, res) => {
        const validar = contas.find(conta => Number(req.body.valor) <= conta.saldo);
        if (!validar) {
            return false
        }
        return true;
    }
};

let proximoNumeroConta = 1;
const gerarNumeroContaUnico = () => {
    if (contas.find(conta => conta.numero === proximoNumeroConta)) {
        proximoNumeroConta++;
        return gerarNumeroContaUnico();
    }
    const numeroGerado = proximoNumeroConta;
    proximoNumeroConta++;
    return numeroGerado;
};

module.exports = {
    validar,
    gerarNumeroContaUnico
}


