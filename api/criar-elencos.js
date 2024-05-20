const { ipcMain, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')

var time = ''
const documentosPath = getDocumentPath()
console.log(documentosPath)

function getDocumentPath() {
    if (process.platform === 'win32') {
        return process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'Documents') : null
    } else {
        return process.env.HOME ? path.join(process.env.HOME, 'Documents') : null
    }
}

function criarElencos() {
    definirConfigs()
}

function definirConfigs() { // Define a pasta onde está os elencos mais recentes
    time = hora()

    const elencos = {
        pasta: time
    }

    if (fs.existsSync(path.join(documentosPath, 'STT', 'config', 'myconfigs', 'elencos.json'))) {
        return
    }

    fs.mkdir(path.join(documentosPath, 'STT', 'config', 'myconfigs', time), { recursive: true }, (err) => { // Cria no formato ddmmyyyyhhmmss
        if (err) {
            return console.error(`Erro ao criar a pasta: ${err}`)
        }

        const elencosJSON = JSON.stringify(elencos)
        fs.writeFile(path.join(documentosPath, 'STT', 'config', 'myconfigs', 'elencos.json'), elencosJSON, (err) => {
            if (err) {
                return console.log(err)
            }
            console.log('Arquivo JSON criado com sucesso!')
        })
    })

    criarJogadores(time) // Passa o nome da pasta que vai ser criada
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

            var filePath = path.join(documentosPath, 'STT', 'config', 'myconfigs', time, 'jogadores.json')

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

                criarTimes(time)
            })
        })
    })
}

function criarTimes(time) {
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

        const sql = `select * from times`

        connection.query(sql, (err, rows) => {
            if (err) {
                console.error('Erro ao executar a consulta:', err)
                return
            }
            var jsonContent = JSON.stringify(rows, null, 2)

            var filePath = path.join(documentosPath, 'STT', 'config', 'myconfigs', time, 'times.json')

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

                criarCompeticoes(time)
            })
        })
    })
}

function criarCompeticoes(time) {
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

        const sql = `select * from competicoes`

        connection.query(sql, (err, rows) => {
            if (err) {
                console.error('Erro ao executar a consulta:', err)
                return
            }
            var jsonContent = JSON.stringify(rows, null, 2)

            var filePath = path.join(documentosPath, 'STT', 'config', 'myconfigs', time, 'competicoes.json')

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

                criarLikLigasTimes(time)
            })
        })
    })
}

function criarLikLigasTimes(time) {
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

        const sql = `select * from link_liga_time`

        connection.query(sql, (err, rows) => {
            if (err) {
                console.error('Erro ao executar a consulta:', err)
                return
            }
            var jsonContent = JSON.stringify(rows, null, 2)

            var filePath = path.join(documentosPath, 'STT', 'config', 'myconfigs', time, 'linkligatime.json')

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

    return dia + mes + ano + hora + minuto + segundo
}


module.exports = {
    criarElencos
}