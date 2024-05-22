const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')
require('dotenv').config()

const { connectionMySQL } = require('../server/connection')

var time = '' // É A HORA E NÃO O TIME

function criarCarreira() {
    criarJogadores()
}

const criarJogadores = async () => {
    try {
        const jogadores = await connectionMySQL(`SELECT * FROM jogadores`)
        console.log('Resultado:', jogadores)

        const jsonContent = JSON.stringify(jogadores, null, 2)

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

        criarTimes(time)
    } catch (error) {
        console.error('Erro ao obter jogadores:', error)
    }
}

const criarTimes = async (time) => {
    try {
        const times = await connectionMySQL(`SELECT * FROM times`)
        console.log('Resultado:', times)

        var jsonContent = JSON.stringify(times, null, 2)

        var filePath = path.join(__dirname, '..', 'config', 'saves', time, 'times.json')

        fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
            if (err) {
                console.error('Erro ao escrever o arquivo:', err)
                return
            }
        })
    } catch (error) {
        console.error('Erro ao obter times:', error)
    }
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