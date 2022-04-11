import { createElement, useMemo, useState } from 'react'
import ExplorerGrid from 'components/ExplorerGrid'
import ExplorerTable from 'components/ExplorerTable'
import Layout from 'components/Layout'
import PresentationDialog from 'components/PresentationDialog'
import { Content } from 'interfaces'
import { useStore } from 'utils/StoreContext'

const IndexPage = () => {
  const [dialogState, setDialogState] = useState<
    | {
        open: false
      }
    | { open: true; path: string }
  >({ open: false })

  const { explorer, history, settings, sorting } = useStore()

  const filteredContents = useMemo(
    () =>
      explorer.contents.filter(
        (content) => !explorer.query || content.name.includes(explorer.query)
      ),
    [explorer.contents, explorer.query]
  )

  const sortOption = useMemo(
    () => sorting.getOption(history.directory),
    [history.directory, sorting]
  )

  const handleKeyDownEnter = () =>
    setDialogState({ path: explorer.selected[0], open: true })

  const handleChangeSortOption = (sortOption: {
    order: 'asc' | 'desc'
    orderBy: 'name' | 'rating' | 'dateModified'
  }) => {
    sorting.sort(history.directory, sortOption)
  }

  const handleClickContent = (content: Content) =>
    explorer.setSelected([content.path])

  const handleDoubleClickContent = (content: Content) =>
    history.push(content.path)

  const handleFocusContent = (content: Content) =>
    explorer.setSelected([content.path])

  const isContentSelected = (content: Content) =>
    explorer.selected.includes(content.path)

  const handleRequestClose = () => setDialogState({ open: false })

  return (
    <Layout>
      {createElement(
        settings.explorerLayout === 'list' ? ExplorerTable : ExplorerGrid,
        {
          contentSelected: isContentSelected,
          contents: filteredContents,
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
    </Layout>
  )
}

export default IndexPage
