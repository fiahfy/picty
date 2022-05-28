import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import ExplorerGrid from 'components/ExplorerGrid'
import ExplorerTable from 'components/ExplorerTable'
import PresentationDialog from 'components/PresentationDialog'
import { ExplorerContent } from 'interfaces'
import { useAppDispatch, useAppSelector } from 'store'
import {
  select,
  selectContents,
  selectIsSelected,
  selectLoading,
  selectQuery,
  selectSelectedContents,
} from 'store/explorer'
import {
  move,
  scroll,
  selectCurrentDirectory,
  selectCurrentScrollTop,
} from 'store/history'
import { selectGetRating } from 'store/rating'
import { selectExplorerLayout } from 'store/settings'
import { selectGetSortOption, sort } from 'store/sorting'
import { isImageFile } from 'utils/image'

const IndexPage = () => {
  const contents = useAppSelector(selectContents)
  const currentDirectory = useAppSelector(selectCurrentDirectory)
  const currentScrollTop = useAppSelector(selectCurrentScrollTop)
  const explorerLayout = useAppSelector(selectExplorerLayout)
  const getRating = useAppSelector(selectGetRating)
  const getSortOption = useAppSelector(selectGetSortOption)
  const isSelected = useAppSelector(selectIsSelected)
  const loading = useAppSelector(selectLoading)
  const query = useAppSelector(selectQuery)
  const selectedContents = useAppSelector(selectSelectedContents)
  const dispatch = useAppDispatch()

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
    () => getSortOption(currentDirectory),
    [currentDirectory, getSortOption]
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

  const explorerContents = useMemo(
    () =>
      contents
        .filter(
          (content) =>
            !query || content.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((content) => ({
          ...content,
          rating: getRating(content.path),
        }))
        .sort((a, b) => comparator(a, b)),
    [comparator, contents, getRating, query]
  )

  const isContentSelected = (content: ExplorerContent) =>
    isSelected(content.path)

  const handleKeyDownEnter = () => {
    const content = selectedContents[0]
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
    dispatch(sort({ path: currentDirectory, option: sortOption }))
  }

  const handleClickContent = (content: ExplorerContent) =>
    dispatch(select(content.path))

  const handleDoubleClickContent = async (content: ExplorerContent) =>
    content.type === 'directory'
      ? dispatch(move(content.path))
      : await window.electronAPI.openPath(content.path)

  const handleFocusContent = (content: ExplorerContent) =>
    dispatch(select(content.path))

  const handleRequestClose = () => setDialogState({ open: false, path: '' })

  const handleScroll = (e: Event) => {
    if (!loading && e.target instanceof HTMLElement) {
      dispatch(scroll(e.target.scrollTop))
    }
  }

  return (
    <>
      {createElement(explorerLayout === 'list' ? ExplorerTable : ExplorerGrid, {
        contentSelected: isContentSelected,
        contents: explorerContents,
        loading,
        onChangeSortOption: handleChangeSortOption,
        onClickContent: handleClickContent,
        onDoubleClickContent: handleDoubleClickContent,
        onFocusContent: handleFocusContent,
        onKeyDownEnter: handleKeyDownEnter,
        onScroll: handleScroll,
        scrollTop: currentScrollTop,
        sortOption,
      })}
      <PresentationDialog
        onRequestClose={handleRequestClose}
        open={dialogState.open}
        path={dialogState.path}
      />
    </>
  )
}

export default IndexPage
