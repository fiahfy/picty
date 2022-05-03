import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import ExplorerGrid from 'components/ExplorerGrid'
import ExplorerTable from 'components/ExplorerTable'
import PresentationDialog from 'components/PresentationDialog'
import { ExplorerContent } from 'interfaces'
import { useStore } from 'contexts/StoreContext'

const IndexPage = () => {
  const { explorer, history, rating, settings, sorting } = useStore()

  const [dialogState, setDialogState] = useState<
    | {
        open: false
      }
    | { open: true; path: string }
  >({ open: false })

  useEffect(() => {
    const unsubscribe = window.electronAPI.subscribeStartPresentation((path) =>
      setDialogState({ path, open: true })
    )
    return () => unsubscribe()
  }, [explorer.selected])

  const sortOption = useMemo(
    () => sorting.getOption(history.directory),
    [history.directory, sorting]
  )

  const comparator = useCallback(
    (a: ExplorerContent, b: ExplorerContent) => {
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

  const contents = useMemo(
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

  const handleClickContent = (content: ExplorerContent) =>
    explorer.setSelected([content.path])

  const handleDoubleClickContent = async (content: ExplorerContent) =>
    content.type === 'directory'
      ? history.push(content.path)
      : await window.electronAPI.openPath(content.path)

  const handleFocusContent = (content: ExplorerContent) =>
    explorer.setSelected([content.path])

  const isContentSelected = (content: ExplorerContent) =>
    explorer.selected.includes(content.path)

  const handleRequestClose = () => setDialogState({ open: false })

  return (
    <>
      {createElement(
        settings.explorerLayout === 'list' ? ExplorerTable : ExplorerGrid,
        {
          contentSelected: isContentSelected,
          contents,
          loading: explorer.loading,
          onChangeSortOption: handleChangeSortOption,
          onClickContent: handleClickContent,
          onDoubleClickContent: handleDoubleClickContent,
          onFocusContent: handleFocusContent,
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
