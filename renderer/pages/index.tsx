import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import ExplorerGrid from 'components/ExplorerGrid'
import ExplorerTable from 'components/ExplorerTable'
import PresentationDialog from 'components/PresentationDialog'
import { Item } from 'interfaces'
import { useStore } from 'utils/StoreContext'

const IndexPage = () => {
  const [dialogState, setDialogState] = useState<
    | {
        open: false
      }
    | { open: true; path: string }
  >({ open: false })

  const { explorer, history, rating, settings, sorting } = useStore()

  useEffect(() => {
    const unsubscribe = window.electronAPI.subscribeStartPresentation(() => {
      setDialogState({ path: explorer.selected[0], open: true })
    })
    return () => unsubscribe()
  }, [explorer.selected])

  const sortOption = useMemo(
    () => sorting.getOption(history.directory),
    [history.directory, sorting]
  )

  const comparator = useCallback(
    (a: Item, b: Item) => {
      let result = 0
      const aValue = a[sortOption.orderBy]
      const bValue = b[sortOption.orderBy]
      if (aValue !== undefined && bValue !== undefined) {
        if (aValue > bValue) {
          result = 1
        } else if (aValue < bValue) {
          result = -1
        }
      } else {
        result = 0
      }
      const orderSign = sortOption.order === 'desc' ? -1 : 1
      return orderSign * result
    },
    [sortOption]
  )

  const items = useMemo(
    () =>
      explorer.contents
        .filter(
          (content) => !explorer.query || content.name.includes(explorer.query)
        )
        .map((content) => ({
          ...content,
          rating: rating.getRating(content.path),
        }))
        .sort((a, b) => comparator(a, b)),
    [comparator, explorer.contents, explorer.query, rating]
  )

  const handleKeyDownEnter = () =>
    setDialogState({ path: explorer.selected[0], open: true })

  const handleChangeSortOption = (sortOption: {
    order: 'asc' | 'desc'
    orderBy: 'name' | 'rating' | 'dateModified'
  }) => {
    sorting.sort(history.directory, sortOption)
  }

  const handleClickItem = (item: Item) => explorer.setSelected([item.path])

  const handleDoubleClickItem = async (item: Item) =>
    item.type === 'directory'
      ? history.push(item.path)
      : await window.electronAPI.openPath(item.path)

  const handleFocusItem = (item: Item) => explorer.setSelected([item.path])

  const isItemSelected = (item: Item) => explorer.selected.includes(item.path)

  const handleRequestClose = () => setDialogState({ open: false })

  return (
    <>
      {createElement(
        settings.explorerLayout === 'list' ? ExplorerTable : ExplorerGrid,
        {
          itemSelected: isItemSelected,
          items,
          loading: explorer.loading,
          onChangeSortOption: handleChangeSortOption,
          onClickItem: handleClickItem,
          onDoubleClickItem: handleDoubleClickItem,
          onFocusItem: handleFocusItem,
          onKeyDownEnter: handleKeyDownEnter,
          sortOption,
        }
      )}
      {dialogState.open && (
        <PresentationDialog
          onRequestClose={handleRequestClose}
          open
          path={dialogState.path}
        />
      )}
    </>
  )
}

export default IndexPage
