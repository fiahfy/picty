<template>
  <v-navigation-drawer class="sidebar" permanent app :width="width">
    <v-row class="fill-height flex-nowrap" no-gutters>
      <activity-bar
        class="flex-shrink-0"
        :navigator="state.navigator"
        @click-menu="handleClickMenu"
      />
      <v-layout column>
        <v-toolbar flat dense class="flex-grow-0">
          <span class="overline user-select-none flex-grow-0">
            Files
          </span>
        </v-toolbar>
        <v-row no-gutters class="overflow-auto">
          <v-treeview
            :active.sync="state.active"
            :open.sync="state.open"
            :items="state.items"
            :load-children="fetchChildren"
            activatable
            dense
            item-key="path"
          >
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="item.children">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else>
                {{ state.files[item.file] || 'mdi-file' }}
              </v-icon>
            </template>
          </v-treeview>
        </v-row>
      </v-layout>
    </v-row>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from '@vue/composition-api'
import ActivityBar from '~/components/ActivityBar.vue'

const workerPromisify = require('@fiahfy/worker-promisify').default
const Worker = require('~/workers/file.worker.js')

const worker = workerPromisify(new Worker())

export default defineComponent({
  components: {
    ActivityBar,
  },
  setup(_props: {}) {
    const state = reactive({
      navigator: 'files',
      active: [],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      tree: [],
      items: [
        {
          name: '/',
          path: '/',
          children: [],
        },
      ],
    })

    const width = computed(() => {
      return state.navigator ? 512 : 48
    })

    const handleClickMenu = (item: any) => {
      state.navigator =
        state.navigator === item.navigator ? undefined : item.navigator
    }

    const fetchChildren = async (item: any) => {
      try {
        const { data } = await worker.postMessage({
          method: 'listFiles',
          args: [item.path],
        })
        item.children = data.map((item: any) => {
          return {
            name: item.name,
            path: item.path,
            children: item.directory ? [] : undefined,
          }
        })
      } catch (e) {
        //
      }
    }

    return {
      state,
      width,
      handleClickMenu,
      fetchChildren,
    }
  },
})
</script>
