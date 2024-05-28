$(document).ready(function () {
    $('#simular-partida').on('click', () => {
        setTimeout(() => {
            window.location.href = 'simular.html'
        }, 1000)
    })

    $('#criar-carreira').on('click', () => {
        // window.api.criarCarreira().then(() => {
        //     console.log('funfou')
        // })
        setTimeout(() => {
            window.location.href = 'criar-carreira.html'
        }, 1000)
    })
})