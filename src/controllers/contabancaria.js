let { contas, depositos, saques, transferencias } = require('../data/bancodedados');
const { validar, gerarNumeroContaUnico} = require('./validacao');
const format = require('date-fns/format');
const ptBR = require('date-fns/locale/pt-BR');

const listarContas = (req, res) => {
    return res.status(200).json(contas)
}


const criarContas = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!validar.dados(req, res)) {
        return res.status(400).json({mensagem: 'Os dados precisam ser preenchidos  '})
    }

    if (!validar.cpf_email(req, res)) {
        return res.status(403).json({mensagem: "Já existe uma conta com o cpf ou e-mail informado!"})
    }
    
    
    const novoNumeroConta = gerarNumeroContaUnico();
    const novaConta = {
        numero: JSON.stringify(novoNumeroConta),
        saldo: 0,
        usuario: {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
        }
    }
    contas.push(novaConta);
    return res.status(201).json()
}


const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!validar.dados(req)) {
        return res.status(400).json({mensagem: 'Os dados precisam ser preenchidos  '})
    }
    if (!validar.numeroConta(req)) {
        return res.status(400).json({ mensagem: 'Conta não encontrada' })
    }

    const cpfCadastrado = contas.find(conta => conta.usuario.cpf === cpf && conta.numero !== numeroConta);    
    const emailCadastrado = contas.find(conta => conta.usuario.email === email && conta.numero !== numeroConta);

    if (cpfCadastrado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf informado!" })
    }
    if (emailCadastrado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o email informado!" })
    }

    contas.map((conta) => {
        if (conta.numero === numeroConta) {
            conta.usuario.nome = nome;
            conta.usuario.cpf = cpf;
            conta.usuario.data_nascimento = data_nascimento;
            conta.usuario.telefone = telefone;
            conta.usuario.email = email;
            conta.usuario.senha = senha;
        }
    })
    res.status(204).send();
}


const excluirConta = (req, res) => {

    if (!req.params.numeroConta) {
        return res.status(400).json({ mensagem: 'Conta não encontrada' });
    }

    const excluirConta = contas.find(conta => conta.numero === req.params.numeroConta);

    if (!excluirConta) {
        return res.status(400).json({ mensagem: 'Conta não encontrada' });
    }

    if (excluirConta.saldo !== 0) {
        return res.status(403).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    }

    const indiceDeExclusao = contas.indexOf(excluirConta);
    
    if (indiceDeExclusao !== -1) {
        contas.splice(indiceDeExclusao, 1);
    }

    return res.status(204).json();
};



const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!validar.numero_valor(req, res)) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!"});
    }
    if (!validar.contaExistente(req, res)) {
        return res.status(400).json({ mensagem: "Conta não encontrada!" })
    }
    if (!validar.valor(req, res)) {
        return res.status(400).json({ mensagem: "O valor deve ser maior que zero!" })        
    }

    const deposito = {
        data: format(new Date(), "eeee 'dia' dd 'de' LLLL 'de' yyyy 'às' HH:mm:ss", { locale: ptBR }),
        numero_conta,
        valor
    }
    contas.map((conta) => {
        if (conta.numero === numero_conta) {
            conta.saldo += Number(valor);
        }
    })
    depositos.push(deposito)

    return res.status(204).json();
}



const sacar = (req, res) => {
    const { numero_conta, valor } = req.body;
    if (!validar.numero_valor_senha(req, res)) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!"});        
    }
    if (!validar.contaExistente(req, res)) {
        return res.status(400).json({ mensagem: "Conta não encontrada!" })
    }
    if (!validar.senha(req, res)) {
        return res.status(400).json({ mensagem: "Senha incorreta!" })
    }

    if (!validar.valor(req)) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" })
    }
    const validarSaldo = contas.find(conta => conta.numero === numero_conta);
    if (validarSaldo.saldo < Number(valor)) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" })
    }
    validarSaldo.saldo -= Number(valor);

    const saque = {
        data: format(new Date(), "eeee 'dia' dd 'de' LLLL 'de' yyyy 'às' HH:mm:ss", { locale: ptBR }),
        numero_conta,
        valor
    }
    saques.push(saque)
    res.status(201).json();
}


const transferir = (req, res) => {

    if (!validar.numeroContas_valor_senha(req, res)) {
        return res.status(400).json({ mensagem: "Os dados precisam ser preenchidos!"})
    }
    const { numero_conta_origem, numero_conta_destino, senha, valor} = req.body;

    const contaOrigemExiste = contas.find(conta => conta.numero === numero_conta_origem);
    const contaDestinoExiste = contas.find(conta => conta.numero === numero_conta_destino);
    
    if (!contaOrigemExiste) {
        return res.status(400).json({ mensagem: "Conta não encontrada!" })
    }
    if (!contaDestinoExiste) {
        return res.status(400).json({ mensagem: "Conta não encontrada!" })
    }
    const senhaCorreta = contas.find((conta) => conta.usuario.senha === senha && conta.numero === numero_conta_origem);
    if (!senhaCorreta) {
        return res.status(400).json({ mensagem: "Senha incorreta!" })
    }
    if (contaOrigemExiste.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" })
    }
    contaOrigemExiste.saldo -= Number(valor)
    contaDestinoExiste.saldo += Number(valor)
    const transferir = {
        data: format(new Date(), "eeee 'dia' dd 'de' LLLL 'de' yyyy 'às' HH:mm:ss", { locale: ptBR }),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }
    transferencias.push(transferir)    
    
    return res.status(201).json();
}


const listarSaldo = (req, res) => {
    if (!validar.numero_conta_senha(req, res)) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" })
    }
    const conta = contas.find(conta => conta.numero === req.query.numero_conta)
    if (!conta) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" })
    }
    const senhaCorreta = contas.find(conta => conta.usuario.senha === req.query.senha && conta.numero === req.query.numero_conta);
    if (!senhaCorreta) {
        return res.status(400).json({ mensagem: "Senha incorreta!" })
    }
    const listarSaldo = {
        saldo: conta.saldo
    }
    res.status(200).json(listarSaldo)
}


const listarExtrato = (req, res) => {

    if (!validar.numero_conta_senha(req, res)) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" })
    }
    const conta = contas.find(conta => conta.numero === req.query.numero_conta)
    if (!conta) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" })
    }
    const senhaCorreta = contas.find(conta => conta.usuario.senha === req.query.senha && conta.numero === req.query.numero_conta);
    if (!senhaCorreta) {
        return res.status(400).json({ mensagem: "Senha incorreta!" })
    }
    const listarExtrato = {
        depositos: depositos.filter(deposito => deposito.numero_conta === req.query.numero_conta),
        saques: saques.filter(saque => saque.numero_conta === req.query.numero_conta),
        transferenciasEnviadas: transferencias.filter(transferencia => transferencia.numero_conta_origem === req.query.numero_conta),
        transferenciasRecebidas: transferencias.filter(transferencia => transferencia.numero_conta_destino === req.query.numero_conta)
    }
    res.status(200).json(listarExtrato)
}



module.exports = {
    listarContas,
    criarContas,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    listarSaldo,
    listarExtrato
};