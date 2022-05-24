import {
  BrowserView,
  BrowserWindow,
  IpcMainInvokeEvent,
  MenuItemConstructorOptions,
  WebContents,
  ipcMain,
} from 'electron'
import contextMenu from 'electron-context-menu'

const webContents = (
  win: BrowserWindow | BrowserView | Electron.WebviewTag | WebContents
) => ('webContents' in win ? win.webContents : win)

type MenuParams = {
  id: string
  enabled: boolean
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

// @see https://github.com/sindresorhus/electron-context-menu/issues/102#issuecomment-735434790
export const createContextMenu = () => {
  let menuParams: MenuParams[]

  const buildMenus = (
    options: (MenuItemConstructorOptions & {
      callback?: (params: MenuParams) => MenuItemConstructorOptions
    })[]
  ) => {
    return options.reduce((carry, options) => {
      if (options.id && options.callback) {
        const params = menuParams.find((params) => params.id === options.id)
        return params ? [...carry, options.callback(params)] : carry
      } else {
        return [...carry, options]
      }
    }, [] as MenuItemConstructorOptions[])
  }

  contextMenu({
    prepend: (_defaultActions, parameters, browserWindow) => {
      return buildMenus([
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
          id: 'start-presentation',
          callback: (params) => ({
            accelerator: 'Enter',
            click: () => {
              const wc = webContents(browserWindow)
              wc && wc.send('start-presentation', params.value)
            },
            enabled: params.enabled,
            label: 'Start Presentation',
          }),
        },
        { type: 'separator' },
        {
          id: 'remove-favorite',
          callback: (params) => ({
            click: () => {
              const wc = webContents(browserWindow)
              wc && wc.send('remove-favorite', params.value)
            },
            enabled: params.enabled,
            label: 'Remove from Favorites',
          }),
        },
      ])
    },
  })

  ipcMain.handle(
    'send-params-for-context-menu',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_event: IpcMainInvokeEvent, targetMenuParams?: any) =>
      (menuParams = targetMenuParams ?? [])
  )
}
