document.addEventListener('DOMContentLoaded', () => {

    // const { ipcRenderer } = require('electron')


})

$(document).ready(function () {
    const btnCriarJogadores = document.getElementById('btnCriarJogadores')
    btnCriarJogadores.addEventListener('click', () => {
        window.api.criarCarreira().then(() => {
            console.log('funfou')
        })
    })
})