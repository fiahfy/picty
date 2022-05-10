import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import ExplorerGrid from 'components/ExplorerGrid'
import ExplorerTable from 'components/ExplorerTable'
import PresentationDialog from 'components/PresentationDialog'
import { ExplorerContent } from 'interfaces'
import { useStore } from 'contexts/StoreContext'
import { isImageFile } from 'utils/image'

const IndexPage = () => {
  const { explorer, history, rating, settings, sorting } = useStore()

  const [dialogState, setDialogState] = useState<{
    open: boolean
    path: string
  }>({ open: false, path: '' })

  useEffect(() => {
    const unsubscribe = window.electronAPI.subscribeStartPresentation((path) =>
      setDialogState({ open: true, path })
    )
    return () => unsubscribe()
  }, [])

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

  const handleKeyDownEnter = () => {
    const content = explorer.selected[0]
    if (
      content &&
      (content.type === 'directory' || isImageFile(content.path))
    ) {
      setDialogState({ path: content.path, open: true })
    }
  }

  const handleChangeSortOption = (sortOption: {
    order: 'asc' | 'desc'
    orderBy: 'name' | 'rating' | 'dateModified'
  }) => {
    sorting.sort(history.directory, sortOption)
  }

  const handleClickContent = (content: ExplorerContent) =>
    explorer.setSelected([content])

  const handleDoubleClickContent = async (content: ExplorerContent) =>
    content.type === 'directory'
      ? history.push(content.path)
      : await window.electronAPI.openPath(content.path)

  const handleFocusContent = (content: ExplorerContent) =>
    explorer.setSelected([content])

  const isContentSelected = (content: ExplorerContent) =>
    explorer.isSelected(content)

  const handleRequestClose = () => setDialogState({ open: false, path: '' })

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
      <PresentationDialog
        onRequestClose={handleRequestClose}
        open={dialogState.open}
        path={dialogState.path}
      />
    </>
  )
}

export default IndexPage
