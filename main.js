// Soccer Touchline Tactician -> Electron
const { app, BrowserWindow, ipcMain, contextBridge } = require('electron')
const path = require('path')
const criaCarreira = require('./api/criar-carreira')
const criaElenco = require('./api/criar-elencos')
const consultarJogador = require('./api/consultar-jogador')
const consultarCompeticao = require('./api/consultar-competicao')
const consultarLinkLigas = require('./api/consultar-linkligas')
const consultarTimes = require('./api/consultar-time')

openDb ()

var mainWindow = null

app.whenReady().then(() => {
    createWindow()
})

app.on('activate', () => { // Para macOs
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

async function createWindow() { // Inicia a Janela
    const minWidth = 800
    const minHeight = 600

    mainWindow = new BrowserWindow({
        width: Math.max(minWidth, 800),
        height: Math.max(minHeight, 600),
        icon: path.join(__dirname, 'src', 'assets', 'img', 'logoSTT', 'logoSTT.ico'),
        // fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: true,
            backgroundThrottling: false
            // devTools: false
        }
    })

    mainWindow.setMinimumSize(minWidth, minHeight)

    mainWindow.webContents.on('zoom-changed', (event) => {
        event.preventDefault()
    })

    // mainWindow.setMenu(null)
    await mainWindow.loadFile('src/views/index.html')

    // Define funções para o HTML
    ipcMain.handle('CriarCarreira', async () => {
        return criaCarreira.criarCarreira()
    })

    ipcMain.handle('CriarElencos', async () => {
        return criaElenco.criarElencos()
    })

    ipcMain.handle('ConsultarJogador', async (event, idJogador) => {
        try {
            const result = await consultarJogador.consultarJogador(idJogador)
            return result
        } catch (error) {
            console.error('Erro ao consultar jogador:', error)
            throw error
        }
    })

    ipcMain.handle('ConsultarCompeticao', async (event, idCompeticao) => {
        try {
            const result = await consultarCompeticao.consultarCompeticao(idCompeticao)
            return result
        } catch (error) {
            console.error('Erro ao consultar competição:', error)
            throw error
        }
    })

    ipcMain.handle('consultarLinkLigas', async (event, idCompeticao) => {
        try {
            const result = await consultarLinkLigas.consultarLinkLigas(idCompeticao)
            return result
        } catch (error) {
            console.error('Erro ao consultar ligas:', error)
            throw error
        }
    })

    ipcMain.handle('consultarTimes', async (event, idTimes) => {
        try {
            const result = await consultarTimes.consultarTimes(idTimes)
            return result
        } catch (error) {
            console.error('Erro ao consultar times:', error)
            throw error
        }
    })
}
