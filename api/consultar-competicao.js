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

function consultarCompeticao(idCompeticao) {
    return new Promise((resolve, reject) => {
        procurarCompeticao(idCompeticao, (err, competicao) => {
            if (err) {
                console.log("Erro ao procurar competição:", err)
                reject(err)
            } else {
                console.log(competicao)
                resolve(competicao)
            }
        })
    })
}

function procurarCompeticao(idCompeticao, callback) {
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
                const sql = idCompeticao ? 
                    `SELECT * FROM competicoes WHERE id = ?` : 
                    `SELECT * FROM competicoes`
                const params = idCompeticao ? [idCompeticao] : []
                db.all(sql, params, (err, rows) => {
                    if (err) {
                        console.error("Erro ao executar a consulta:", err.message)
                        callback(err)
                        return
                    }
                    callback(null, idCompeticao ? rows[0] : rows)
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
    consultarCompeticao
}