$(document).ready(() => {
    const container = document.getElementById('aparencia-tecnico')

    for (let i = 0; i <= 22; i++) {
        const img = document.createElement('img')
        img.id = `rosto-tecnico-${i}`
        img.src = `../assets/img/tecnicos_generic/${i}.jpeg`
        img.classList.add('escolha-tecnico', 'rosto-tecnico')
        container.appendChild(img)
    }
})