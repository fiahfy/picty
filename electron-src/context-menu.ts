import {
  BrowserView,
  BrowserWindow,
  IpcMainInvokeEvent,
  WebContents,
  ipcMain,
} from 'electron'
import contextMenu from 'electron-context-menu'

const webContents = (
  win: BrowserWindow | BrowserView | Electron.WebviewTag | WebContents
) => ('webContents' in win ? win.webContents : win)

export const createContextMenu = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let params: any

  contextMenu({
    prepend: (_defaultActions, parameters, browserWindow) => {
      return [
        {
          accelerator: 'CommandOrControl+F',
          click: () => {
            const wc = webContents(browserWindow)
            wc && wc.send('search')
          },
          label: 'Search for “{selection}”',
          visible: parameters.selectionText.trim().length > 0,
        },
        {
          accelerator: 'Enter',
          click: () => {
            const wc = webContents(browserWindow)
            wc && wc.send('start-presentation')
          },
          enabled: params.enabled,
          label: 'Start Presentation',
          visible: params.id === 'presentation',
        },
      ]
    },
  })

  // @see https://github.com/sindresorhus/electron-context-menu/issues/102#issuecomment-735434790
  ipcMain.handle(
    'send-params-for-context-menu',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_event: IpcMainInvokeEvent, targetParams?: any) =>
      (params = targetParams ?? {})
  )
}
