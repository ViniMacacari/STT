const fs = require('fs')
const path = require('path')

// consultarJogador(49931408)

function consultarJogador(idJogador) {
    return new Promise((resolve, reject) => {
        procuraJogador(idJogador, (err, jogador) => {
            if (err) {
                console.log("Erro ao procurar jogador:", err)
                reject(err)
            } else {
                console.log(jogador)
                resolve(jogador)
            }
        })
    })
}

function getDocumentPath() {
    if (process.platform === 'win32') {
        return process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'Documents') : null
    } else {
        return process.env.HOME ? path.join(process.env.HOME, 'Documents') : null
    }
}

function procuraJogador(idJogador, callback) {
    fs.readFile((path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', 'elencos.json')), 'utf8', (err, jsonString) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err)
            return
        }
        try {
            const data = JSON.parse(jsonString)
            fs.readFile((path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', data.pasta, 'jogadores.json')), 'utf8', (err, jsonString) => {
                if (err) {
                    console.error("Erro ao ler o arquivo:", err)
                    return
                }
                try {
                    const dataJogadores = JSON.parse(jsonString)
                    const jogador = dataJogadores.find(jogador => jogador.id === idJogador)
                    callback(null, jogador)
                } catch (err) {
                    console.error('Erro ao analisar o JSON:', err)
                }
            })
        } catch (err) {
            console.error('Erro ao analisar o JSON:', err)
        }
    })
}

module.exports = {
    consultarJogador
}