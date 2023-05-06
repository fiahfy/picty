// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export interface IElectronAPI {
  basename: (path: string) => Promise<string>
  darwin: () => Promise<boolean>
  dirname: (path: string) => Promise<string>
  getFileNode: (path: string) => Promise<FileNode>
  getPresentationData: (
    path: string
  ) => Promise<{ title: string; files: File[] }>
  handleDoubleClickTitleBar: () => Promise<void>
  homePath: () => Promise<string>
  listContents: (path: string) => Promise<Content[]>
  listFiles: (path: string) => Promise<File[]>
  openPath: (path: string) => Promise<void>
  sendParamsForContextMenu: (params?: unknown) => Promise<void>
  subscribeAddToFavorites: (callback: (path: string) => void) => () => void
  subscribeRemoveFromFavorites: (callback: (path: string) => void) => () => void
  subscribeShowSettings: (callback: () => void) => () => void
  subscribeStartPresentation: (callback: (path: string) => void) => () => void
  subscribeSearch: (callback: () => void) => () => void
}

export type File = {
  name: string
  path: string
  type: 'file' | 'directory' | 'other'
}
export type FileNode = File & { children?: FileNode[] }
export type Content = File & { dateModified: number }
export type ExplorerContent = Content & { rating: number }

export type MenuParams = {
  id: string
  enabled: boolean
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
