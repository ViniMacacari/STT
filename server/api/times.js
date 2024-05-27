const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs').promises
const os = require('os')
require('dotenv').config()

const jsonPath = path.join(os.homedir(), 'Documents', 'STT', 'config', 'myconfigs', 'elencos.json')
let pathVariavel

async function loadDatabasePath() {
    try {
        const jsonString = await fs.readFile(jsonPath, 'utf8')
        const data = JSON.parse(jsonString)
        pathVariavel = path.join(os.homedir(), 'Documents', 'STT', 'config', 'myconfigs', data.pasta, 'stt.db')
        console.log('Database path set to:', pathVariavel)
    } catch (err) {
        console.error('Erro ao ler o arquivo JSON:', err)
    }
}

async function timesRouter() {
    await loadDatabasePath()

    const router = express.Router()

    router.get('/', async (req, res) => {
        if (!pathVariavel) {
            return res.status(500).json({ error: 'Database path not set' })
        }

        console.log('Tentando conectar ao banco de dados em:', pathVariavel)

        let db = new sqlite3.Database(pathVariavel, sqlite3.OPEN_READWRITE, err => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err.message)
                return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' })
            }
            console.log('Conectado ao banco de dados SQLite.')
        })

        const sql = `SELECT * FROM times`

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Erro na consulta ao banco de dados:', err.message)
                return res.status(500).json({ error: 'Erro na consulta ao banco de dados' })
            }

            console.log('Consulta executada com sucesso')

            if (rows && rows.length > 0) {
                console.log('Registros encontrados:', rows)
                res.json(rows)
            } else {
                console.log('Nenhum registro encontrado')
                res.status(404).json({ message: 'Nenhum registro encontrado' })
            }

            db.close(err => {
                if (err) {
                    console.error('Erro ao fechar a conexão com o banco de dados:', err.message)
                } else {
                    console.log('Conexão com o banco de dados SQLite fechada.')
                }
            })
        })
    })

    return router
}

module.exports = timesRouter
