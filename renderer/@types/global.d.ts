import { IElectronAPI } from 'interfaces'

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
