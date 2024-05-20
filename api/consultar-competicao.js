const fs = require('fs')
const path = require('path')

function consultarCompeticao(idCompeticao) {
    return new Promise((resolve, reject) => {
        procurarCompeticao(idCompeticao, (err, competicao) => {
            if (err) {
                console.log("Erro ao procurar competicao:", err)
                reject(err)
            } else {
                console.log(competicao)
                resolve(competicao)
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

function procurarCompeticao(idCompeticao, callback) {
    fs.readFile((path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', 'elencos.json')), 'utf8', (err, jsonString) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err)
            return
        }
        try {
            const data = JSON.parse(jsonString)
            fs.readFile((path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', data.pasta, 'competicoes.json')), 'utf8', (err, jsonString) => {
                if (err) {
                    console.error("Erro ao ler o arquivo:", err)
                    return
                }
                try {
                    const dataJSON = JSON.parse(jsonString)
                    if (idCompeticao != undefined || idCompeticao != null) {
                        const competicao = dataJSON.find(competicao => competicao.id === idCompeticao)
                        console.log("competicao")
                        callback(null, competicao)
                    } else {
                        callback(null, dataJSON)
                    }
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
    consultarCompeticao
}