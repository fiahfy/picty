<template>
  <v-layout column class="files-navigator">
    <v-toolbar flat dense class="flex-grow-0">
      <span class="subtitle-2 text-uppercase user-select-none flex-grow-0">
        Files
      </span>
    </v-toolbar>
    <v-row no-gutters class="overflow-auto">
      <v-treeview
        :active.sync="state.active"
        :open.sync="state.open"
        :items="state.items"
        :load-children="handleLoadChildren"
        dense
        item-key="path"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.children">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else>
            {{ icons[item.extension] || 'mdi-file' }}
          </v-icon>
        </template>
        <template v-slot:label="{ item }">
          <div class="node" @click="() => handleClickItem(item)">
            {{ item.name }}
          </div>
        </template>
      </v-treeview>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import path from 'path'
import {
  defineComponent,
  reactive,
  watch,
  SetupContext,
} from '@vue/composition-api'
import ActivityBar from '~/components/ActivityBar.vue'
import { File } from '~/models'
import { explorerStore } from '~/store'

const workerPromisify = require('@fiahfy/worker-promisify').default
const Worker = require('~/workers/fetch-files.worker')

const worker = workerPromisify(new Worker())

const icons = {
  html: 'mdi-language-html5',
  js: 'mdi-nodejs',
  json: 'mdi-json',
  md: 'mdi-markdown',
  pdf: 'mdi-file-pdf',
  png: 'mdi-file-image',
  txt: 'mdi-file-document-outline',
  xls: 'mdi-file-excel',
}

type Item = {
  name: string
  path: string
  children?: Item[]
}

export default defineComponent({
  components: {
    ActivityBar,
  },
  setup(_props: {}, context: SetupContext) {
    const state = reactive<{
      active: string[]
      open: string[]
      items: Item[]
    }>({
      active: [],
      open: [],
      items: [],
    })

    const fetch = async (dirPath: string) => {
      try {
        const { data } = await worker.postMessage({ dirPath })
        return data.map((item: File) => {
          return {
            name: item.name,
            path: item.path,
            children: item.directory ? [] : undefined,
          }
        })
      } catch (e) {
        return []
      }
    }
    const loadDirectory = async (dirPath: string) => {
      const dirnames = dirPath.split(path.sep)

      // for osx
      if (dirnames[0] === '') {
        dirnames[0] = '/'
      }
      if (dirPath === '') {
        dirPath = '/'
      }

      if (dirnames.length === 1 && !state.items.length) {
        state.items = [
          {
            name: dirPath,
            path: dirPath,
            children: [],
          },
        ]
      }

      const item = dirnames.reduce(
        (carry: Item | undefined, dirname) => {
          return carry?.children?.find((item) => item.name === dirname)
        },
        { name: 'root', path: 'root', children: state.items }
      )
      if (item) {
        if (item.children && !item.children.length) {
          item.children = await fetch(dirPath)
        }
        if (!state.open.includes(dirPath)) {
          state.open = [...state.open, dirPath]
        }
      }
    }

    const handleLoadChildren = async (item: Item) => {
      item.children = await fetch(item.path)
    }
    const handleClickItem = (item: Item) => {
      if (item.children) {
        context.root.$eventBus.$emit('change-location', item.path)
      }
    }

    watch(
      () => explorerStore.location,
      async (location) => {
        const dirPathes = location.split(path.sep).reduce((carry, dirname) => {
          const dirPath = carry.length
            ? carry[carry.length - 1] + path.sep + dirname
            : dirname
          return [...carry, dirPath]
        }, [] as string[])
        for (const dirPath of dirPathes.slice(0, -1)) {
          await loadDirectory(dirPath)
        }
        state.active = [location]
      }
    )

    return {
      state,
      icons,
      handleLoadChildren,
      handleClickItem,
    }
  },
})
</script>

<style lang="scss" scoped>
.files-navigator ::v-deep .node {
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
