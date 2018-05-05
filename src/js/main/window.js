import { BrowserWindow } from 'electron'
import windowStateKeeper from 'electron-window-state'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import MenuBuilder from './menu-builder'

export default class Window {
  constructor (app) {
    this.app = app
  }
  open () {
    const windowState = windowStateKeeper({
      defaultWidth: 820,
      defaultHeight: 600
    })

    const options = {
      ...windowState,
      titleBarStyle: 'hidden'
    }

    const url = process.env.NODE_ENV === 'production'
      ? `file://${__dirname}/app/html/index.html`
      : 'http://localhost:3000/html/index.html'

    this.win = new BrowserWindow(options)
    this.win.loadURL(url)

    windowState.manage(this.win)

    const builder = new MenuBuilder(this)
    builder.build()

    if (process.env.NODE_ENV !== 'production') {
      this.setupDevTools()
    }
    this.addEventListeners()
  }
  addEventListeners () {
    this.win.on('closed', () => {
      this.win = null
      this.app.removeWindow()
    })
    this.win.on('enter-full-screen', () => {
      this.win.webContents.send('enterFullScreen')
    })
    this.win.on('leave-full-screen', () => {
      this.win.webContents.send('leaveFullScreen')
    })
  }
  setupDevTools () {
    installExtension(VUEJS_DEVTOOLS.id)
      .catch((err) => {
        console.log('Unable to install `vue-devtools`: \n', err) // eslint-disable-line no-console
      })
    this.win.openDevTools()
  }
  sendMessage (channel) {
    this.win.webContents.send(channel)
  }
}
