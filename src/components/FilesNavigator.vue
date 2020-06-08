<template>
  <v-layout column class="files-navigator">
    <v-toolbar flat dense class="flex-grow-0">
      <span class="subtitle-2 text-uppercase user-select-none flex-grow-0">
        Files
      </span>
    </v-toolbar>
    <v-row no-gutters class="overflow-auto scrollbar">
      <v-treeview
        :active.sync="state.active"
        :open.sync="state.open"
        :items="state.nodes"
        :load-children="handleLoadChildren"
        item-key="path"
        dense
        class="user-select-none"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.children" color="blue lighten-3">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else-if="item.path" color="green lighten-3">
            mdi-file-image
          </v-icon>
          <v-icon v-else color="grey">
            mdi-folder-multiple-image
          </v-icon>
        </template>
        <template v-slot:label="{ item }">
          <div class="node text-truncate" @click="() => handleClickNode(item)">
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
import { explorerStore, settingsStore } from '~/store'

const workerPromisify = require('@fiahfy/worker-promisify').default
const Worker = require('~/workers/fetch-files.worker')

const worker = workerPromisify(new Worker())

const maxChildren = 100

type Node = {
  name: string
  path?: string
  children?: Node[]
}

export default defineComponent({
  components: {
    ActivityBar,
  },
  setup(_props: {}, context: SetupContext) {
    const state = reactive<{
      active: string[]
      open: string[]
      nodes: Node[]
    }>({
      active: [],
      open: [],
      nodes: [],
    })

    const fetch = async (dirPath: string) => {
      try {
        const { data }: { data: File[] } = await worker.postMessage({ dirPath })
        const files = data.filter(
          (file) =>
            file.directory ||
            settingsStore.isFileAvailable({ filePath: file.path })
        )
        let others: Node[] = []
        if (files.length > maxChildren) {
          const size = files.length - maxChildren
          others = [
            {
              name: `Other ${size} items`,
            },
          ]
        }
        const items = files.slice(0, maxChildren).map((file) => {
          return {
            name: file.name,
            path: file.path,
            children: file.directory ? [] : undefined,
          }
        })
        return [...items, ...others]
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

      if (dirnames.length === 1 && !state.nodes.length) {
        state.nodes = [
          {
            name: dirPath,
            path: dirPath,
            children: [],
          },
        ]
      }

      const node = dirnames.reduce(
        (carry: Node | undefined, dirname) => {
          return carry?.children?.find((node) => node.name === dirname)
        },
        { name: 'root', path: 'root', children: state.nodes }
      )
      if (node) {
        if (node.children && !node.children.length) {
          node.children = await fetch(dirPath)
        }
        if (!state.open.includes(dirPath)) {
          state.open = [...state.open, dirPath]
        }
      }
    }

    const handleLoadChildren = async (node: Node) => {
      if (node.path) {
        node.children = await fetch(node.path)
      }
    }
    const handleClickNode = (node: Node) => {
      if (node.children) {
        context.root.$eventBus.$emit('change-location', node.path)
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
      handleLoadChildren,
      handleClickNode,
    }
  },
})
</script>

<style lang="scss" scoped>
.files-navigator ::v-deep .node {
  cursor: pointer;
  height: 40px;
  line-height: 40px;
}
</style>
