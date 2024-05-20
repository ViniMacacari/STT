$(document).ready(function () {
    var keyPressed = false

    $(document).keypress(function (event) {
        if (keyPressed == false) {
            keyPressed = true
            $('h1, h3').css('animation', 'none')
            $('h1, h3').fadeOut()
            setTimeout(function () {
                criaElenco ()
            }, 2000)
        }
    })
})

function criaElenco () { // Cria as configurações de elencos
    window.api.criarElencos().then((result) => {
        if (result)
        window.location.href = "home.html"
    }).catch ((error) => {
        console.error(error)
    })
}