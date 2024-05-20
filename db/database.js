const sqlite3 = require('sqlite3').verbose()

const dbPath = 'stt.db'

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message)
        return
    }

    console.log('Conectado ao banco de dados SQLite.')

    // db.serialize(() => {
    //     console.log("Executando a função serialize")

    //     db.each('SELECT * FROM teste', (err, row) => {
    //         if (err) {
    //             console.error('Erro ao executar a consulta:', err.message)
    //             return
    //         }
    //         console.log("Resultado:", row)
    //     }, () => {
    //         db.close((err) => {
    //             if (err) {
    //                 console.error('Erro ao fechar a conexão com o banco de dados:', err.message)
    //             } else {
    //                 console.log('Conexão com o banco de dados fechada.')
    //             }
    //         })
    //     })
    // })
})

module.exports = db