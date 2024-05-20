const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

// Chamada de exemplo
// consultarTimes([546, 542, 551, 558, 556, 1738, 559, 1745, 1748, 1737, 1865, 1802, 1875, 1877, 1879, 1929, 1985, 2015, 2018, 2017])

function consultarTimes(ids) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(ids)) {
            reject(new Error("O argumento deve ser um array de IDs."))
            return
        }
        procuraTimes(ids, (err, times) => {
            if (err) {
                console.log("Erro ao procurar times:", err)
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

function procuraTimes(ids, callback) {
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
                const placeholders = ids.map(() => '?').join(',')
                const sql = `SELECT * FROM times WHERE id IN (${placeholders}) ORDER BY nome ASC`
                db.all(sql, ids, (err, rows) => {
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
    consultarTimes
}