<template>
  <v-card class="explorer-card" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-btn
        :title="'Presentation' | accelerator('Enter')"
        :disabled="!canPresentation"
        icon
        @click="handleClickPresentation"
      >
        <v-icon>mdi-presentation</v-icon>
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
        ref="queryField"
        :value="state.queryInput"
        :search-input.sync="state.searchInput"
        class="ml-3"
        :items="queryHistories"
        name="query"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        dense
        filled
        rounded
        single-line
        hide-details
        clearable
        @input="handleInput"
        @keydown="handleKeyDown"
        @contextmenu.stop="handleContextMenu"
        @click:prepend-inner="handleClickMagnify"
      >
        <template v-slot:item="{ item }">
          <v-list-item-content>
            <v-list-item-title v-text="item" />
          </v-list-item-content>
          <v-list-item-action class="my-0">
            <v-btn
              small
              icon
              color="primary"
              @click.stop="() => handleClickItemDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
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
  watchEffect,
  onMounted,
  onUnmounted,
  ref,
} from '@vue/composition-api'
import { explorerStore, queryHistoryStore } from '~/store'

type Props = {
  canPresentation: boolean
  query: string
}

export default defineComponent({
  props: {
    canPresentation: {
      type: Boolean,
      default: false,
    },
    query: {
      type: String,
      default: '',
    },
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive({
      queryInput: '',
      searchInput: '',
    })

    const listColor = computed(() => {
      return explorerStore.listStyle === 'list' ? 'primary' : null
    })
    const thumbnailColor = computed(() => {
      return explorerStore.listStyle === 'thumbnail' ? 'primary' : null
    })
    const queryHistories = computed(() => {
      return queryHistoryStore.histories.slice().reverse()
    })

    const queryField = ref<Vue>(null)

    const focusQuery = () => {
      ;(queryField.value?.$el.querySelector(
        'input'
      ) as HTMLInputElement).focus()
    }
    const handleClickPresentation = () => {
      context.emit('click-presentation')
    }
    const handleClickList = () => {
      explorerStore.setListStyle({ listStyle: 'list' })
    }
    const handleClickThumbnail = () => {
      explorerStore.setListStyle({ listStyle: 'thumbnail' })
    }
    const handleInput = (value?: string) => {
      context.emit('change-query', value ?? '')
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        !e.isComposing &&
        e.target instanceof HTMLInputElement
      ) {
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

    watchEffect(() => {
      state.queryInput = props.query
    })

    onMounted(() => {
      context.root.$eventBus.$on('focus-query', focusQuery)
    })

    onUnmounted(() => {
      context.root.$eventBus.$off('focus-query', focusQuery)
    })

    return {
      state,
      listColor,
      thumbnailColor,
      queryHistories,
      queryField,
      handleClickPresentation,
      handleClickList,
      handleClickThumbnail,
      handleInput,
      handleKeyDown,
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
