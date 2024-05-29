// Soccer Touchline Tactician -> Electron
const { app, BrowserWindow, ipcMain, contextBridge } = require('electron')
const path = require('path')
const { rotas } = require('./server/server') // Servidor express
const criaCarreira = require('./api/criar-carreira')
const criaElenco = require('./api/criar-elencos')
const consultarJogador = require('./api/consultar-jogador')
const consultarCompeticao = require('./api/consultar-competicao')
const consultarLinkLigas = require('./api/consultar-linkligas')
const consultarTimes = require('./api/consultar-time')

var mainWindow = null

app.whenReady().then(() => {
    createWindow()
    rotas().then(() => {
        console.log('Servidor inicializado com sucesso.')
    }).catch(err => {
        console.error('Erro ao inicializar o servidor:', err)
    })
})

app.on('activate', () => { // Para macOs
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

async function createWindow() { // Inicia a Janela
    const minWidth = 1270
    const minHeight = 720

    mainWindow = new BrowserWindow({
        width: Math.max(minWidth, 1270),
        height: Math.max(minHeight, 720),
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
        return new Promise((resolve, reject) => {
            criaCarreira.criarCarreira(() => {
                resolve(true)
            })
        })
    })

    ipcMain.handle('CriarElencos', async () => {
        return new Promise((resolve, reject) => {
            criaElenco.criarElencos(() => {
                resolve(true)
            })
        })
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
