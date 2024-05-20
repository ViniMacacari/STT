$(document).ready(function () {
    let idJogador = 49931408

    window.api.consultarJogador(idJogador)
        .then(jogador => {
            if (jogador) {
                console.log(jogador)
            }
        })
        .catch(err => {
            console.error('Erro ao buscar jogador:')
        })
})