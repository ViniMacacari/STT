document.addEventListener('DOMContentLoaded', () => { // Desabilitar sugestões de input
    const inputs = document.querySelectorAll('input')

    inputs.forEach(input => {
        // Configurações adicionais para desativar auto-preenchimento
        input.setAttribute('autocomplete', 'new-password')
        input.setAttribute('autocorrect', 'off')
        input.setAttribute('autocapitalize', 'off')
        input.setAttribute('spellcheck', 'false')

        // Adiciona e remove um valor falso para evitar preenchimento automático
        input.value = ''
        setTimeout(() => {
            input.value = ''
        }, 1)

        // Desativa e reativa rapidamente o input para tentar prevenir auto-preenchimento
        input.disabled = true
        setTimeout(() => {
            input.disabled = false
        }, 10)

        // Adiciona um manipulador de eventos para garantir que autocomplete esteja desativado
        input.addEventListener('focus', (event) => {
            event.target.setAttribute('autocomplete', 'new-password')
        })
    })
})
