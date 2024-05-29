$(document).ready(() => {
    fetch('http://localhost:9682/nacionalidade')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText)
            }
            return response.json()
        })
        .then(data => {
            const input = document.getElementById('input-nacionalidade-carreira')
            const datalist = document.getElementById('list-nacionalidades')

            // Função para exibir todos os itens no datalist
            function showAllItems() {
                datalist.innerHTML = ''
                data.forEach(item => {
                    const option = document.createElement('li')
                    option.textContent = item.nome
                    option.addEventListener('mousedown', (event) => {
                        event.preventDefault() // Evita a perda de foco no input
                        input.value = item.nome
                        input.blur() // Desfoca o input
                        datalist.classList.add('hidden-datalist')
                        datalist.classList.remove('visible-datalist')
                    })
                    datalist.appendChild(option)
                })
            }

            // Sempre mostrar a lista ao focar no input
            input.addEventListener('focus', () => {
                datalist.classList.add('visible-datalist')
                datalist.classList.remove('hidden-datalist')
                showAllItems()
            })

            // Filtrar e exibir a lista enquanto o usuário digita
            input.addEventListener('input', () => {
                const value = input.value.toLowerCase()
                const filteredData = data.filter(item => item.nome.toLowerCase().includes(value))
                datalist.innerHTML = ''

                if (filteredData.length > 0) {
                    filteredData.forEach(item => {
                        const option = document.createElement('li')
                        option.textContent = item.nome
                        option.addEventListener('mousedown', (event) => {
                            event.preventDefault() // Evita a perda de foco no input
                            input.value = item.nome
                            input.blur() // Desfoca o input
                            datalist.classList.add('hidden-datalist')
                            datalist.classList.remove('visible-datalist')
                        })
                        datalist.appendChild(option)
                    })
                } else {
                    const option = document.createElement('li')
                    option.textContent = 'Nenhuma nacionalidade encontrada'
                    datalist.appendChild(option)
                }
            })

            // Esconder a lista quando o input perder o foco e validar o valor
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    datalist.classList.add('hidden-datalist')
                    datalist.classList.remove('visible-datalist')
                    
                    // Verificar se o valor do input está na lista de nacionalidades
                    const value = input.value
                    const isValid = data.some(item => item.nome === value)
                    if (!isValid) {
                        input.value = '' // Limpar o valor se não for válido
                    }
                }, 100)
            })
        })
        .catch(error => console.error('Erro ao buscar nacionalidades:', error))
})
