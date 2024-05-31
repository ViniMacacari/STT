const { criarCarreira } = require('../../../api/criar-carreira')
const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs').promises
const os = require('os')
require('dotenv').config()

const jsonPath = path.join(os.homedir(), 'Documents', 'STT', 'config', 'myconfigs', 'career')
let pathVariavel

async function loadDatabasePath() {
    try {
        const directories = await fs.readdir(jsonPath, { withFileTypes: true })
        const folderPaths = directories
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(jsonPath, dirent.name))

        const folderStats = await Promise.all(folderPaths.map(async folderPath => {
            const stats = await fs.stat(folderPath)
            return { folderPath, mtime: stats.mtime }
        }))

        const mostRecentFolder = folderStats.sort((a, b) => b.mtime - a.mtime)[0].folderPath

        pathVariavel = path.join(mostRecentFolder, 'stt.db')
        console.log('Database path set to:', pathVariavel)
    } catch (err) {
        console.error('Erro ao ler o arquivo JSON:', err)
    }
}

async function timesRouter() {
    await loadDatabasePath()

    const router = express.Router()

    router.get('/', async (req, res) => {
        const { nome, nascimento, nacionalidade, fotoTecnico, idTime } = req.query

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

        const sql = {
            0: {
                create: 'CREATE TABLE IF NOT EXISTS dados_tecnico (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, nascimento INTEGER, nacionalidade TEXT, fotoTecnico INTEGER, time INTEGER)',
                insert: `INSERT INTO dados_tecnico (nome, posicao) VALUES (${nome}, ${nascimento}, ${nacionalidade}, ${fotoTecnico}, ${idTime})`
            },
            1: {
                create: 'CREATE TABLE IF NOT EXISTS estatisticas_tecnico (id INTEGER PRIMARY KEY AUTOINCREMENT, vitorias INTEGER, empates INTEGER, derrotas INTEGER, golsPro INTEGER, golsContra INTEGER)',
                insert: `INSERT INTO estatisticas_tecnico (vitorias, empates, derrotas, golsPro, golsContra) VALUES (0, 0, 0, 0, 0)`
            },
            2: {
                create: 'CREATE TABLE IF NOT EXISTS contratacoes (id INTEGER PRIMARY KEY AUTOINCREMENT, posicao INTEGER, time_origem INTEGER, time_destino INTEGER, valor REAL, data_contratacao TEXT)'
            },
            3: {
                create: 'CREATE TABLE IF NOT EXISTS estatisticas_jogadores (id INTEGER PRIMARY KEY AUTOINCREMENT, id_jogador INTEGER, vitorias INTEGER, empates INTEGER, derrotas INTEGER, golsPro INTEGER, assistencias INTEGER, golsContra INTEGER, posicao INTEGER, time INTEGER, ano INTEGER)'
            },
            4: {
                create: 'CREATE TABLE IF NOT EXISTS estatisticas_times (id INTEGER PRIMARY KEY AUTOINCREMENT, id_time INTEGER, vitorias INTEGER, empates INTEGER, derrotas INTEGER, golsPro INTEGER, golsContra INTEGER, posicao_liga INTEGER, ano INTEGER)'
            },
            5: {
                create: 'CREATE TABLE IF NOT EXISTS estatisticas_competicoes (id INTEGER PRIMARY KEY AUTOINCREMENT, id_competicao INTEGER, time_campeao INTEGER, ano INTEGER)'
            }
        }

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Erro na consulta ao banco de dados:', err.message)
                return res.status(500).json({ error: 'Erro na consulta ao banco de dados' })
            }


        })
    })

    return router
}

module.exports = timesRouter