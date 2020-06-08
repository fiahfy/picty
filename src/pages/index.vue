<template>
  <v-container class="index" fill-height fluid pa-0>
    <v-layout column>
      <explorer-toolbar
        class="flex-grow-0"
        @click-back="handleClickBack"
        @click-forward="handleClickForward"
        @click-upward="handleClickUpward"
        @click-reload="handleClickReload"
        @click-home="handleClickHome"
        @change-location="handleChangeLocation"
        @change-history="handleChangeHistory"
      />
      <explorer-card
        class="flex-grow-0"
        :can-presentation="!!state.selected"
        :query="state.query"
        @click-presentation="handleClickPresentation"
        @change-query="handleChangeQuery"
      />
      <v-container fluid pa-0 overflow-hidden flex-grow-1>
        <component
          :is="component"
          :items="items"
          :loading="state.loading"
          :selected="state.selected"
          :sort-by="state.sortBy"
          :sort-desc="state.sortDesc"
          class="fill-height"
          @click-header="handleClickHeader"
          @click-item="handleClickItem"
          @dblclick-item="handleDoubleClickItem"
          @contextmenu-item="handleContextMenuItem"
          @change-rating="handleChangeRating"
          @change-sort-option="handleChangeSortOption"
          @keydown.native="handleKeyDown"
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
import { File, Item } from '~/models'
import {
  explorerStore,
  settingsStore,
  ratingStore,
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
      items: Item[]
      selected?: Item
      sortBy: keyof Item
      sortDesc: boolean
      query: string
    }>({
      loading: false,
      error: undefined,
      items: [],
      selected: undefined,
      sortBy: 'name',
      sortDesc: false,
      query: '',
    })

    const component = computed(() =>
      explorerStore.listStyle === 'list' ? ExplorerTable : ExplorerGridList
    )
    const items = computed(() => {
      return state.items
        .concat()
        .sort((a, b) => {
          let result = 0
          const aValue = a[state.sortBy]
          const bValue = b[state.sortBy]
          if (aValue !== undefined && bValue !== undefined) {
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
        .filter((item) => {
          return (
            !state.query ||
            item.name.toLowerCase().includes(state.query.toLowerCase())
          )
        })
    })

    const load = async () => {
      if (state.loading) {
        return
      }
      state.selected = undefined
      state.loading = true
      state.items = []
      try {
        const { data }: { data: File[] } = await worker.postMessage({
          dirPath: explorerStore.location,
        })
        state.items = data
          .filter(
            (file) => file.directory || settingsStore.isFileAvailable(file.path)
          )
          .map((file) => {
            return {
              ...file,
              rating: ratingStore.getRating(file.path),
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
      explorerStore.setLocation(location)
      load()
    }
    const search = (query: string) => {
      queryHistoryStore.addHistory(query)
      state.query = query
    }
    const go = async (offset: number) => {
      if (state.loading) {
        return
      }
      const history = await historyStore.go(offset)
      if (history) {
        explorerStore.setLocation(history)
        load()
      }
    }

    const handleClickBack = async () => {
      await go(-1)
    }
    const handleClickForward = async () => {
      await go(1)
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
    const handleClickPresentation = () => {
      context.root.$eventBus.$emit('show-presentation', state.selected)
    }
    const handleClickHeader = (header: { value: string }) => {
      state.sortDesc = state.sortBy === header.value ? !state.sortDesc : false
      state.sortBy = header.value as keyof Item
    }
    const handleClickItem = (item: Item) => {
      state.selected = item
    }
    const handleDoubleClickItem = (item: Item) => {
      move(item.path)
    }
    const handleContextMenuItem = (item: Item) => {
      state.selected = item
      let template: MenuItemConstructorOptions[] = [
        {
          label: 'View',
          click: () => context.root.$eventBus.$emit('show-presentation', item),
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
    const handleChangeLocation = (location: string) => {
      move(location)
    }
    const handleChangeQuery = (query: string) => {
      search(query)
    }
    const handleChangeHistory = (offset: number) => {
      go(offset)
    }
    const handleChangeSortOption = ({
      by,
      desc,
    }: {
      by: string
      desc: boolean
    }) => {
      state.sortBy = by as keyof Item
      state.sortDesc = desc
    }
    const handleChangeRating = (item: Item, rating: number) => {
      ratingStore.setRating(rating, item.path)
      // update item
      state.items = state.items.map((current) =>
        current.path === item.path
          ? {
              ...current,
              rating,
            }
          : current
      )
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          return context.root.$eventBus.$emit(
            'show-presentation',
            state.selected
          )
      }
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
      handleClickPresentation,
      handleClickItem,
      handleClickHeader,
      handleDoubleClickItem,
      handleContextMenuItem,
      handleChangeLocation,
      handleChangeQuery,
      handleChangeHistory,
      handleChangeSortOption,
      handleChangeRating,
      handleKeyDown,
    }
  },
})
</script>
