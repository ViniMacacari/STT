const fs = require('fs')
const path = require('path')

consultarLinkLigas(99)

function consultarLinkLigas(idLiga) {
    return new Promise((resolve, reject) => {
        procuraTimes(idLiga, (err, times) => {
            if (err) {
                console.log("Erro ao procurar link da liga:", err)
                reject(err)
            } else {
                console.log(times)
                resolve(times)
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

function procuraTimes(idLiga, callback) {
    fs.readFile((path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', 'elencos.json')), 'utf8', (err, jsonString) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err)
            return
        }
        try {
            const data = JSON.parse(jsonString)
            fs.readFile((path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', data.pasta, 'linkligatime.json')), 'utf8', (err, jsonString) => {
                if (err) {
                    console.error("Erro ao ler o arquivo:", err)
                    return
                }
                try {
                    const dataTimes = JSON.parse(jsonString)
                    const times = dataTimes.filter(times => times.IdCompeticao == idLiga)
                    callback(null, times)
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
    consultarLinkLigas
}