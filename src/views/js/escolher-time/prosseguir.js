var dadosRecebidos
var evento

$(document).ready(() => {
    dadosRecebidos = sessionStorage.getItem('tecnico')
    console.log(dadosRecebidos)
    evento = sessionStorage.getItem('evento')
})