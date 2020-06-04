<template>
  <v-container class="explorer" fill-height fluid pa-0>
    <v-layout column>
      <explorer-toolbar
        class="flex-grow-0"
        @click-back="handleClickBack"
        @click-forward="handleClickForward"
        @click-upward="handleClickUpward"
        @click-reload="handleClickReload"
        @click-home="handleClickHome"
      />
      <explorer-card
        class="flex-grow-0"
        :can-view="!!state.selectedFile"
        :query="state.query"
        @click-view="handleClickView"
        @change-query="handleChangeQuery"
      />
      <v-container fluid pa-0 overflow-hidden flex-grow-1>
        <component
          :is="component"
          :items="items"
          :loading="state.loading"
          :selected="state.selectedFile"
          :sort-by="state.sortBy"
          :sort-desc="state.sortDesc"
          class="fill-height"
          @click-header="handleClickHeader"
          @click-item="handleClickItem"
          @dblclick-item="handleDoubleClickItem"
          @contextmenu-item="handleContextMenuItem"
          @change-rating="handleChangeRating"
          @change-sort-option="handleChangeSortOption"
        />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import path from 'path'
import { remote, MenuItemConstructorOptions } from 'electron'
import {
  defineComponent,
  computed,
  reactive,
  SetupContext,
  onMounted,
  onUnmounted,
} from '@vue/composition-api'
import ExplorerToolbar from '~/components/ExplorerToolbar.vue'
import ExplorerCard from '~/components/ExplorerCard.vue'
import ExplorerTable from '~/components/ExplorerTable.vue'
import ExplorerGridList from '~/components/ExplorerGridList.vue'
import { File } from '~/models'
import {
  explorerStore,
  settingsStore,
  ratingStore,
  viewStore,
  historyStore,
  queryHistoryStore,
} from '~/store'

const workerPromisify = require('@fiahfy/worker-promisify').default
const Worker = require('~/workers/fetch-files.worker')

const worker = workerPromisify(new Worker())

export default defineComponent({
  components: {
    ExplorerToolbar,
    ExplorerCard,
  },
  setup(_props: {}, context: SetupContext) {
    const state = reactive<{
      loading: boolean
      error?: Error
      files: File[]
      selectedFile?: File
      sortBy: keyof File
      sortDesc: boolean
      query: string
    }>({
      loading: false,
      error: undefined,
      files: [] as File[],
      selectedFile: undefined,
      sortBy: 'name',
      sortDesc: false,
      query: '',
    })

    const component = computed(() =>
      explorerStore.listStyle === 'list' ? ExplorerTable : ExplorerGridList
    )
    const items = computed(() => {
      return state.files
        .concat()
        .sort((a, b) => {
          let result = 0
          const aValue = a[state.sortBy]
          const bValue = b[state.sortBy]
          if (aValue && bValue) {
            if (aValue > bValue) {
              result = 1
            } else if (aValue < bValue) {
              result = -1
            }
          } else {
            result = 0
          }
          return state.sortDesc ? -1 * result : result
        })
        .filter((file) => {
          return (
            !state.query ||
            file.name.toLowerCase().includes(state.query.toLowerCase())
          )
        })
    })

    const load = async () => {
      if (state.loading) {
        return
      }
      state.loading = true
      state.files = []
      try {
        const { data } = await worker.postMessage({
          dirPath: explorerStore.location,
        })
        state.files = data
          .filter(
            (file: File) =>
              file.directory ||
              settingsStore.isFileAvailable({ filePath: file.path })
          )
          .map((file: File) => {
            return {
              ...file,
              rating: ratingStore.getRating({ filePath: file.path }),
              views: viewStore.getViews({ filePath: file.path }),
            }
          })
      } catch (e) {
        state.error = e
      }
      state.loading = false
    }
    const move = (location: string) => {
      if (state.loading) {
        return
      }
      historyStore.push(location)
      explorerStore.setLocation({ location })
      load()
    }
    const search = (query: string) => {
      queryHistoryStore.addHistory({ history: query })
      state.query = query
    }

    const handleClickBack = async () => {
      if (state.loading) {
        return
      }
      const history = await historyStore.back()
      if (history) {
        explorerStore.setLocation({ location: history })
        load()
      }
    }
    const handleClickForward = async () => {
      if (state.loading) {
        return
      }
      const history = await historyStore.forward()
      if (history) {
        explorerStore.setLocation({ location: history })
        load()
      }
    }
    const handleClickUpward = () => {
      const filePath = path.dirname(explorerStore.location)
      move(filePath)
    }
    const handleClickHome = () => {
      const filePath = remote.app.getPath('home')
      move(filePath)
    }
    const handleClickReload = () => {
      load()
    }
    const handleClickView = () => {
      context.root.$eventBus.$emit('showViewer', state.selectedFile)
    }
    const handleClickHeader = (header: { value: string }) => {
      state.sortDesc = state.sortBy === header.value ? !state.sortDesc : false
      state.sortBy = header.value as keyof File
    }
    const handleClickItem = (file: File) => {
      state.selectedFile = file
    }
    const handleDoubleClickItem = (file: File) => {
      move(file.path)
    }
    const handleContextMenuItem = (file: File) => {
      state.selectedFile = file
      let template: MenuItemConstructorOptions[] = [
        {
          label: 'View',
          click: () => context.root.$eventBus.$emit('showViewer', file),
          accelerator: 'Enter',
        },
      ]
      const text = window.getSelection()?.toString()
      if (text) {
        template = [
          ...template,
          { type: 'separator' },
          { role: 'copy' },
          {
            label: `Search "${text}"`,
            click: () => search(text),
            accelerator: 'CmdOrCtrl+F',
          },
        ]
      }
      context.root.$contextMenu.open(template)
    }
    const handleChangeRating = (file: File, rating: number) => {
      ratingStore.setRating({
        filePath: file.path,
        rating,
      })
      state.files = state.files.map((item) =>
        item.path === file.path
          ? {
              ...item,
              rating,
            }
          : item
      )
    }
    const handleChangeQuery = (query: string) => {
      search(query)
    }
    const handleChangeSortOption = ({
      by,
      desc,
    }: {
      by: string
      desc: boolean
    }) => {
      state.sortBy = by as keyof File
      state.sortDesc = desc
    }

    load()

    onMounted(() => {
      context.root.$eventBus.$on('change-location', move)
    })

    onUnmounted(() => {
      context.root.$eventBus.$off('change-location', move)
    })

    return {
      state,
      component,
      items,
      handleClickBack,
      handleClickForward,
      handleClickUpward,
      handleClickHome,
      handleClickReload,
      handleClickView,
      handleClickItem,
      handleClickHeader,
      handleDoubleClickItem,
      handleContextMenuItem,
      handleChangeRating,
      handleChangeQuery,
      handleChangeSortOption,
    }
  },
})
</script>
