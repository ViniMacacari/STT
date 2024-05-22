const mysql = require('mysql')

function connectionMySQL(stringSql) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'stt.mysql.uhserver.com',
            user: 'sttadmin',
            password: '27062004@Brasil@',
            database: 'stt'
        })

        connection.connect((err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err)
                reject(err)
                return
            }

            connection.query(stringSql, (err, rows) => {
                if (err) {
                    console.error('Erro ao executar a consulta:', err)
                    reject(err)
                    return
                }

                connection.end((err) => {
                    if (err) {
                        console.error('Erro ao fechar a conexão:', err)
                        reject(err)
                        return
                    }

                    // Converter RowDataPacket para objetos simples
                    const result = rows.map(row => ({ ...row }))
                    resolve(result)
                })
            })
        })
    })
}

module.exports = {
    connectionMySQL
}