$(document).ready(function () {
    window.api.consultarCompeticao()
        .then(competicao => {
            if (competicao) {
                console.log(competicao)
                definirNaBusca(competicao)
            }
        })
        .catch(err => {
            console.error('Erro ao buscar competicao:', err)
        })
})

var idCompeticao = null
var arrayTimes = []

function definirNaBusca(competicoes) {
    competicoes = competicoes.filter(comp => comp.tipo_competicao == 1 || comp.tipo_competicao == 5) // Filtrar apenas competicoes de torneio

    competicoes.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

    console.log(competicoes)

    let currentIndex = 0

    const imgElement = document.getElementById('competicao-img')
    const leftArrow = document.getElementById('seta-esquerda-footer')
    const rightArrow = document.getElementById('seta-direita-footer')

    updateImage()

    leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--
        } else {
            currentIndex = competicoes.length - 1 // Voltar para o final se atingir o início
        }
        updateImage()
    })

    rightArrow.addEventListener('click', () => {
        if (currentIndex < competicoes.length - 1) {
            currentIndex++
        } else {
            currentIndex = 0 // Voltar para o início se atingir o final
        }

        console.log(currentIndex)
        console.log(competicoes)
        updateImage()
    })

    function updateImage() {
        const competicao = competicoes[currentIndex]
        if (competicao.logo != 'SEM IMAGEM') {
            imgElement.src = `../assets/competicoes/${competicao.id}.png`
        } else {
            imgElement.src = `../assets/competicoes/${0}.png` // Definir um placeholder se não houver imagem
        }

        arrayTimes = []

        idCompeticao = competicao.id

        consultarTimesEm(idCompeticao)
    }
}

function consultarTimesEm(idCompeticao) {
    window.api.consultarLinkLigas(idCompeticao)
        .then(times => {
            if (times) {
                console.log(times)
                const ids = times.map(time => time.id_time)
                // Fazer uma única chamada passando todos os IDs
                window.api.consultarTimes(ids)
                    .then(arrayTimes => {
                        arrayTimes = arrayTimes.map(item => ({
                            ...item,
                            nome: String(item.nome)
                        }))
                        console.log("Array antes da ordenação:", arrayTimes)
                        setTimeout(() => {
                            arrayTimes.sort(function (a, b) {
                                if (a.nome < b.nome) {
                                    return -1
                                }
                                if (a.nome > b.nome) {
                                    return 1
                                }
                                return 0
                            })
                            console.log("Array depois da ordenação:", arrayTimes)

                            setTimeout(() => {
                                definirTimesNaBusca(arrayTimes)
                            }, 10)
                        }, 10)
                    })
                    .catch(err => {
                        console.error('Erro durante a busca de detalhes dos times:', err)
                    })
            }
        })
        .catch(err => {
            console.error('Erro ao buscar times:', err)
        })
}


function consultarTimes(idTime) {
    window.api.consultarTimes(idTime)
        .then(times => {
            if (times) {
                arrayTimes.push(times)
            }
        })
        .catch(err => {
            console.error('Erro ao buscar times:', err)
        })
}

function definirTimesNaBusca(times) {
    console.log("a", times)
    times.sort(function (a, b) {
        if (a.nome < b.nome) {
            return -1
        }
        if (a.nome > b.nome) {
            return 1
        }
    })
    console.log("b", times)

    let currentIndex = 0

    const imgElement = document.getElementById('time-img')
    const leftArrow = document.getElementById('seta-esquerda-body')
    const rightArrow = document.getElementById('seta-direita-body')
    const teamName = document.getElementById('nome-time')

    leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--
        } else {
            currentIndex = times.length - 1 // Voltar para o final se atingir o início
        }
        updateImage()
    })

    rightArrow.addEventListener('click', () => {
        if (currentIndex < times.length - 1) {
            currentIndex++
        } else {
            currentIndex = 0 // Voltar para o início se atingir o final
        }
        updateImage()
    })

    setTimeout(() => {
        updateImage()
    }, 100)

    function updateImage() {
        const time = times[currentIndex]
        if (time.logo != 'SEM IMAGEM') {
            imgElement.src = `../assets/teams/${time.id}.png`
            teamName.innerHTML = time.nome
        } else {
            imgElement.src = `../assets/teams/${0}.png` // Definir um placeholder se não houver imagem
            teamName.innerHTML = 'SEM IMAGEM'
        }
    }
}