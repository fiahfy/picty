// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { IpcRendererEvent } from 'electron'

export interface IElectronAPI {
  doubleClickTitleBar: () => Promise<void>
  getDirname: (path: string) => Promise<string>
  getHomePath: () => Promise<string>
  isDarwin: () => Promise<boolean>
  listContents: (path: string) => Promise<Content[]>
  listContentsForPath: (path: string) => Promise<Content[]>
  onSearchText: (
    callback: (event: IpcRendererEvent, text: string) => void
  ) => void
  openPath: (path: string) => Promise<void>
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
