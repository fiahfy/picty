<template>
  <v-card class="explorer-card" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-btn
        :title="'View' | accelerator('Enter')"
        :disabled="!canViewFile"
        icon
        @click="handleClickView"
      >
        <v-icon>mdi-image</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn :color="listColor" title="List" icon @click="handleClickList">
        <v-icon>mdi-view-headline</v-icon>
      </v-btn>
      <v-btn
        :color="thumbnailColor"
        title="Thumbnail"
        icon
        @click="handleClickThumbnail"
      >
        <v-icon>mdi-view-module</v-icon>
      </v-btn>
      <v-autocomplete
        ref="autocomplete"
        :search-input.sync="state.searchInput"
        class="ml-3"
        :items="queryHistories"
        name="query"
        label="Search"
        append-outer-icon="mdi-magnify"
        dense
        single-line
        hide-details
        clearable
        @input="handleInput"
        @keyup.enter="handleKeyUpEnter"
        @contextmenu.stop="handleContextMenu"
        @click:append-outer="handleClickMagnify"
      >
        <template v-slot:item="{ item }">
          <v-list-item-content>
            <v-list-item-title v-text="item" />
          </v-list-item-content>
          <v-list-item-action class="my-0">
            <v-btn
              small
              text
              color="primary"
              @click.stop="() => handleClickItemDelete(item)"
            >
              delete
            </v-btn>
          </v-list-item-action>
        </template>
      </v-autocomplete>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  reactive,
  computed,
} from '@vue/composition-api'
import { explorerStore, queryHistoryStore } from '~/store'

export default defineComponent({
  setup(_props: {}, context: SetupContext) {
    const state = reactive({
      searchInput: '',
    })

    const listColor = computed(() => {
      return explorerStore.listStyle === 'list' ? 'primary' : null
    })
    const thumbnailColor = computed(() => {
      return explorerStore.listStyle === 'thumbnail' ? 'primary' : null
    })
    const canViewFile = computed(() => {
      return false
    })
    const queryHistories = computed(() => {
      return queryHistoryStore.histories.slice().reverse()
    })

    const handleClickView = () => {}
    const handleClickList = () => {
      explorerStore.setListStyle({ listStyle: 'list' })
    }
    const handleClickThumbnail = () => {
      explorerStore.setListStyle({ listStyle: 'thumbnail' })
    }
    const handleInput = (value?: string) => {
      context.emit('change-query', value ?? '')
    }
    const handleKeyUpEnter = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) {
        context.emit('change-query', e.target.value)
      }
    }
    const handleContextMenu = () => {
      context.root.$contextMenu.open([
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ])
    }
    const handleClickMagnify = () => {
      context.emit('change-query', state.searchInput)
    }
    const handleClickItemDelete = (item: string) => {
      queryHistoryStore.removeHistory({ history: item })
    }
    return {
      state,
      listColor,
      thumbnailColor,
      queryHistories,
      canViewFile,
      handleClickView,
      handleClickList,
      handleClickThumbnail,
      handleInput,
      handleKeyUpEnter,
      handleContextMenu,
      handleClickMagnify,
      handleClickItemDelete,
    }
  },
})
</script>

<style scope lang="scss">
.v-autocomplete__content {
  width: 0;
  .v-list__tile__action {
    min-width: unset;
  }
}
</style>
