const express = require('express')
const cors = require('cors')
const app = express()
const port = 9682

app.use(cors())

const nacionalidadeRouter = require('./api/nacionalidade')
const timesRouter = require('./api/times')

async function rotas() {
    try {
        const nacionalidade = await nacionalidadeRouter()
        app.use('/nacionalidade', nacionalidade)

        const times = await timesRouter()
        app.use('/times', times)

        app.listen(port, () => { // HTTP
            console.log(`Servidor rodando em http://localhost:${port}`)
        })
    } catch (err) {
        console.error('Erro ao inicializar o servidor:', err)
    }
}

rotas()