// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export interface IElectronAPI {
  sendMessage: (message: string) => Promise<string>
  isDarwin: () => Promise<boolean>
  doubleClickTitleBar: () => Promise<void>
  listContents: (dirPath: string) => Promise<Content[]>
  getDirname: (filePath: string) => Promise<string>
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
