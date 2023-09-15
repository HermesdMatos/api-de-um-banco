const dados = require('../data/bancodedados');

const verificarSenha = (req, res, next) => {
    if (!req.query.senha_banco) {
        return res.status(400).json({ erro: "A senha do banco não foi informada" });
    }
    const senhaAutenticada = dados.banco.senha === req.query.senha_banco ?
        next() : res.status(401).json({ erro: "A senha do banco informada é inválida!" });
        return senhaAutenticada
}

module.exports = verificarSenha