const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

function getDocumentPath() {
    if (process.platform === 'win32') {
        return process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'Documents') : null
    } else {
        return process.env.HOME ? path.join(process.env.HOME, 'Documents') : null
    }
}

function consultarJogador(idsJogador) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(idsJogador)) {
            reject(new Error("O argumento deve ser um array de IDs."))
            return
        }
        procuraJogadores(idsJogador, (err, jogadores) => {
            if (err) {
                console.log("Erro ao procurar jogadores:", err)
                reject(err)
            } else {
                console.log(jogadores)
                resolve(jogadores)
            }
        })
    })
}

function procuraJogadores(idsJogador, callback) {
    const elencoFilePath = path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', 'elencos.json')
    fs.readFile(elencoFilePath, 'utf8', (err, jsonString) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err)
            return
        }
        try {
            const data = JSON.parse(jsonString)
            const dbPath = path.join(getDocumentPath(), 'STT', 'config', 'myconfigs', data.pasta, 'stt.db')
            const db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error("Erro ao conectar ao banco de dados SQLite:", err.message)
                    callback(err)
                    return
                }
                const placeholders = idsJogador.map(() => '?').join(',')
                const sql = `SELECT * FROM jogadores WHERE id IN (${placeholders}) ORDER BY nome ASC`
                db.all(sql, idsJogador, (err, rows) => {
                    if (err) {
                        console.error("Erro ao executar a consulta:", err.message)
                        callback(err)
                        return
                    }
                    callback(null, rows)
                })
                db.close((err) => {
                    if (err) {
                        console.error("Erro ao fechar a conexão com o banco de dados SQLite:", err.message)
                    }
                })
            })
        } catch (err) {
            console.error('Erro ao analisar o JSON:', err)
        }
    })
}

module.exports = {
    consultarJogador
}
