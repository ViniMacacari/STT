const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')
require('dotenv').config()

var time = ''

function criarCarreira() {
    criarJogadores()
}

function criarJogadores() {
    const connection = mysql.createConnection({
        host: process.env.BDHOST,
        user: process.env.BDUSER,
        password: process.env.BDPASS,
        database: process.env.BDDATABASE
    })

    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err)
            return
        }

        const sql = `select * from jogadores`

        connection.query(sql, (err, rows) => {
            if (err) {
                console.error('Erro ao executar a consulta:', err)
                return
            }
            const jsonContent = JSON.stringify(rows, null, 2)
            var time = hora()

            fs.mkdir(path.join(__dirname, '..', 'config', 'saves', time), { recursive: true }, (err) => { // Cria no formato ddmmyyyyhhmmss
                if (err) {
                    return console.error(`Erro ao criar a pasta: ${err}`)
                }
            })

            var filePath = path.join(__dirname, '..', 'config', 'saves', time, 'jogadores.json')

            fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
                if (err) {
                    console.error('Erro ao escrever o arquivo:', err)
                    return
                }
            })

            connection.end((err) => {
                if (err) {
                    console.error('Erro ao fechar a conexão:', err)
                    return
                }
                console.log('Conexão encerrada com sucesso!')
            })

            criarTimes(time)
        })
    })
}

function criarTimes(time) {
    const connection = mysql.createConnection({
        host: 'stt.mysql.uhserver.com',
        user: 'sttadmin',
        password: '27062004@Brasil@',
        database: 'stt'
    })

    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err)
            return
        }

        const sql = `select * from times`

        connection.query(sql, (err, rows) => {
            if (err) {
                console.error('Erro ao executar a consulta:', err)
                return
            }
            var jsonContent = JSON.stringify(rows, null, 2)

            var filePath = path.join(__dirname, '..', 'config', 'saves', time, 'times.json')

            fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
                if (err) {
                    console.error('Erro ao escrever o arquivo:', err)
                    return
                }
            })

            connection.end((err) => {
                if (err) {
                    console.error('Erro ao fechar a conexão:', err)
                    return
                }
                console.log('Conexão encerrada com sucesso!')
            })
        })
    })
}

function hora() {
    var agora = new Date()

    var dia = agora.getDate().toString().padStart(2, '0')
    var mes = (agora.getMonth() + 1).toString().padStart(2, '0')
    var ano = agora.getFullYear().toString()
    var hora = agora.getHours().toString().padStart(2, '0')
    var minuto = agora.getMinutes().toString().padStart(2, '0')
    var segundo = agora.getSeconds().toString().padStart(2, '0')

    console.log(dia + mes + ano + hora + minuto + segundo)
    return dia + mes + ano + hora + minuto + segundo
}


module.exports = {
    criarCarreira
}