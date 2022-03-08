// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export interface IElectronAPI {
  sendMessage: (message: string) => Promise<string>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

export type User = {
  id: number
  name: string
}
