import { BrowserWindow } from 'electron'
import windowStateKeeper from 'electron-window-state'
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

    const options = { ...windowState, titleBarStyle: 'hidden' }

    this.browserWindow = new BrowserWindow(options)
    this.browserWindow.loadURL(`file://${__dirname}/app/index.html`)

    windowState.manage(this.browserWindow)

    const builder = new MenuBuilder(this.browserWindow)
    builder.build()

    this.addEventListeners()
  }
  addEventListeners () {
    this.browserWindow.on('closed', () => {
      this.browserWindow = null
      this.app.removeWindow()
    })
    this.browserWindow.on('enter-full-screen', () => {
      this.browserWindow.webContents.send('enterFullScreen')
    })
    this.browserWindow.on('leave-full-screen', () => {
      this.browserWindow.webContents.send('leaveFullScreen')
    })
  }
}
