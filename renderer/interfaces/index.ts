// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export interface IElectronAPI {
  doubleClickTitleBar: () => Promise<void>
  getBasename: (path: string) => Promise<string>
  getDirname: (path: string) => Promise<string>
  getHomePath: () => Promise<string>
  isDarwin: () => Promise<boolean>
  listContents: (path: string) => Promise<Content[]>
  listContentsForPath: (path: string) => Promise<Content[]>
  openPath: (path: string) => Promise<void>
  sendParamsForContextMenu: (params?: unknown) => Promise<void>
  subscribeRemoveFavorite: (callback: (path: string) => void) => () => void
  subscribeStartPresentation: (callback: (path: string) => void) => () => void
  subscribeSearch: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

declare module '@mui/material/styles/createMixins' {
  interface Mixins {
    titleBar: CSSProperties
  }
}

export type Content = {
  dateModified: number
  name: string
  path: string
  type: 'file' | 'directory'
}

export type Item = Content & { rating: number }
