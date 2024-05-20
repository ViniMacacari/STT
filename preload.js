const { contextBridge, ipcRenderer } = require('electron')

// let backgroundMusic = new Audio('../musica/HearMeNow.mp3')

contextBridge.exposeInMainWorld('api', {
    criarCarreira: () => ipcRenderer.invoke('CriarCarreira'),
    criarElencos: () => ipcRenderer.invoke('CriarElencos'),
    consultarJogador: (idJogador) => ipcRenderer.invoke('ConsultarJogador', idJogador),
    consultarCompeticao: (idCompeticao) => ipcRenderer.invoke('ConsultarCompeticao', idCompeticao),
    consultarLinkLigas: (idCompeticao) => ipcRenderer.invoke('consultarLinkLigas', idCompeticao),
    consultarTimes: (idTimes) => ipcRenderer.invoke('consultarTimes', idTimes)
})

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('wheel', (event) => {
        if (event.ctrlKey === true) {
            event.preventDefault()
        }
    })

    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '=')) {
            event.preventDefault()
        }
    })
})