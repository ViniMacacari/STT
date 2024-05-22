const { connectionMySQL } = require('../server/connection.js')

const jogadores = async () => {
    const jogadores = connectionMySQL(`select * from times`)
    return jogadores
}

jogadores().then(data => {
    console.log('Resultado:', data)
}).catch(error => {
    console.error('Erro:', error)
})