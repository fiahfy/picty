import { MenuParams } from 'interfaces'

export const contextMenuProps = (menuParams: MenuParams[]) => {
  return {
    'data-params': JSON.stringify(menuParams),
  }
}

export const getContextMenuParams = (e: HTMLElement): string | undefined => {
  const params = e.dataset.params
  if (params) {
    return JSON.parse(params)
  }
  const parent = e.parentElement
  return parent ? getContextMenuParams(parent) : undefined
}
