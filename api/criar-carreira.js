const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

const { connectionMySQL } = require('../database/connection')

function getDocumentPath() {
    if (process.platform === 'win32') {
        return process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'Documents') : null
    } else {
        return process.env.HOME ? path.join(process.env.HOME, 'Documents') : null
    }
}

const documentosPath = getDocumentPath()
const elencoFilePath = path.join(documentosPath, 'STT', 'config', 'career')

function criarCarreira(callback) {
    const time = hora()  // Gera o timestamp uma vez para usar em todo o processo
    const dirPath = path.join(documentosPath, 'STT', 'config', 'career', time)

    // Cria a estrutura de pastas
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }

    const dbPath = path.join(dirPath, 'stt.db')  // Define o caminho do banco de dados SQLite

    let db

    function connectToSQLite() {
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados SQLite:', err.message)
                return
            }
            console.log('Conectado ao banco de dados SQLite.')
        })
    }

    connectToSQLite()

    function convertDateToSQLiteFormat(dateString) {
        const date = new Date(dateString)
        if (isNaN(date)) {
            return dateString  // Return the original string if it's not a valid date
        }
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    function processRow(row) {
        const processedRow = {}
        for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(row, key)) {
                if (row[key] instanceof Date) {
                    processedRow[key] = convertDateToSQLiteFormat(row[key])
                } else if (typeof row[key] === 'string' && !isNaN(Date.parse(row[key]))) {
                    processedRow[key] = convertDateToSQLiteFormat(row[key])
                } else {
                    processedRow[key] = row[key]
                }
            }
        }
        return processedRow
    }

    function transferToSQLite(tableName, rows, callback) {
        if (rows.length === 0) {
            console.log(`Tabela ${tableName} está vazia.`)
            callback()
            return
        }

        const columns = Object.keys(rows[0]).map(col => `${col} TEXT`).join(', ')
        const columnNames = Object.keys(rows[0]).join(', ')
        const placeholders = Object.keys(rows[0]).map(() => '?').join(', ')

        const sqlCreateTable = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`
        db.run(sqlCreateTable, (err) => {
            if (err) {
                console.error(`Erro ao criar a tabela ${tableName} no SQLite:`, err.message)
                callback()
                return
            }

            const sqlInsert = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`
            db.serialize(() => {
                const stmt = db.prepare(sqlInsert)
                rows.forEach(row => {
                    stmt.run(Object.values(processRow(row)), (err) => {
                        if (err) {
                            console.error(`Erro ao inserir dados na tabela ${tableName} no SQLite:`, err.message)
                        }
                    })
                })
                stmt.finalize(callback)
            })
        })
    }

    async function transferTable(tableName, callback) {
        try {
            const rows = await connectionMySQL(`SELECT * FROM ${tableName}`)
            transferToSQLite(tableName, rows, callback)
        } catch (error) {
            console.error(`Erro ao transferir dados da tabela ${tableName}:`, error)
            callback()
        }
    }

    const tables = ['jogadores', 'times', 'competicoes', 'times_competicoes', 'ger_clube', 'ger_tecnico']
    let index = 0

    function next() {
        if (index < tables.length) {
            const tableName = tables[index]
            index++
            transferTable(tableName, next)
        } else {
            console.log('Transferência completa.')

            callback()
        }
    }

    next()
}

function hora() {
    var agora = new Date()

    var dia = agora.getDate().toString().padStart(2, '0')
    var mes = (agora.getMonth() + 1).toString().padStart(2, '0')
    var ano = agora.getFullYear().toString()
    var hora = agora.getHours().toString().padStart(2, '0')
    var minuto = agora.getMinutes().toString().padStart(2, '0')
    var segundo = agora.getSeconds().toString().padStart(2, '0')

    return dia + mes + ano + hora + minuto + segundo
}

module.exports = {
    criarCarreira
}