$(document).ready(() => {
    preencherImagens()
    prosseguir()
    formataCampos()
    configurarCliqueImagem()
})

const configurarCliqueImagem = () => {
    $('#aparencia-tecnico').on('click', 'img', function() {
        $('#aparencia-tecnico img').removeClass('selected')
        $(this).addClass('selected')
    })
}


const formataCampos = () => {
    $('#input-data-tecnico').on('input', () => {
        $('#input-data-tecnico').val($('#input-data-tecnico').val().slice(0, 4))
        date = new Date($('#input-data-tecnico').val())
        ano = new Date().getFullYear()
        if (date.getFullYear() > ano) {
            $('#input-data-tecnico').val('')
        } else if (date.getFullYear() < 191) {
            $('#input-data-tecnico').val('')
        }
    })

    $('#input-nome-tecnico').on('input', () => {
        $('#input-nome-tecnico').val($('#input-nome-tecnico').val().slice(0, 20))
    })
}

var continuar = 0
const prosseguir = () => {
    $('#div-prosseguir').on('click', () => {
        if (continuar == 0) {
            if ($('#input-nome-tecnico').val().length > 5 && $('#input-data-tecnico').val().length == 4 && $('#input-nacionalidade-carreira').val().length > 0) {
                continuar++;
                $('#info-tecnico').addClass('display-none')
                $('#main-container').removeClass('display-none')  

                $('#txt-nome-tecnico').text(`${$('#input-nome-tecnico').val()}, escolha o rosto do seu técnico:`)
            }
        }
    })
}

const preencherImagens = () => {
    const container = document.getElementById('aparencia-tecnico')

    for (let i = 0; i <= 22; i++) {
        const img = document.createElement('img')
        img.id = `rosto-tecnico-${i}`
        img.src = `../assets/img/tecnicos_generic/${i}.jpeg`
        img.classList.add('escolha-tecnico', 'rosto-tecnico')
        container.appendChild(img)
    }
}