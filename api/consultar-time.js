const fs = require('fs')
const path = require('path')

// consultarTimes(556)

function consultarTimes(idTimes) {
    return new Promise((resolve, reject) => {
        procuratime(idTimes, (err, time) => {
            if (err) {
                console.log("Erro ao procurar time:", err)
                reject(err)
            } else {
                console.log(time)
                resolve(time)
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

function procuratime(idTimes, callback) {
    fs.readFile((path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', 'elencos.json')), 'utf8', (err, jsonString) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err)
            return
        }
        try {
            const data = JSON.parse(jsonString)
            fs.readFile((path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', data.pasta, 'times.json')), 'utf8', (err, jsonString) => {
                if (err) {
                    console.error("Erro ao ler o arquivo:", err)
                    return
                }
                try {
                    const dataTimes = JSON.parse(jsonString)
                    const time = dataTimes.find(time => time.id === idTimes)
                    callback(null, time)
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
    consultarTimes
}
