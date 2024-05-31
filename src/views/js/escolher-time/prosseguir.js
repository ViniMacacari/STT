var dadosRecebidos
var evento
var time

$(document).ready(() => {
    dadosRecebidos = sessionStorage.getItem('tecnico')
    evento = sessionStorage.getItem('evento')
    time = sessionStorage.getItem('time')
    const nome = JSON.parse(dadosRecebidos).nome
    const nascimento = JSON.parse(dadosRecebidos).nascimento
    const nacionalidade = JSON.parse(dadosRecebidos).nacionalidade
    const fotoTecnico = JSON.parse(dadosRecebidos).fotoTecnico

    if (evento == 'criar-carreira') {
        fetch(`http://localhost:9682/criar-carreira?nome=${nome}&nascimento=${nascimento}&nacionalidade=${nacionalidade}&fotoTecnico=${fotoTecnico}&idTime=${time}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText)
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => console.log(error))
    }
})