<template>
  <v-card class="explorer-card" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-btn
        :title="'Presentation' | accelerator('Enter')"
        :disabled="!selected"
        icon
        @click="handleClickPresentation"
      >
        <v-icon>mdi-presentation</v-icon>
      </v-btn>
      <v-btn
        :title="'Favorite' | accelerator('')"
        :color="favorite ? 'primary' : ''"
        :disabled="!selected || !selected.directory"
        icon
        @click="handleClickFavorite"
      >
        <v-icon v-text="favorite ? 'mdi-heart' : 'mdi-heart-outline'" />
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
      <v-combobox
        ref="queryField"
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
      </v-combobox>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  ref,
  SetupContext,
  watch,
} from '@vue/composition-api'
import { Item } from '~/models'
import { explorerStore, favoriteStore, queryHistoryStore } from '~/store'

type Props = {
  selected: Item
  query: string
}

export default defineComponent({
  props: {
    selected: {
      type: Object,
    },
    query: {
      type: String,
    },
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive({
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
    const favorite = computed(() => {
      return props.selected && favoriteStore.isFavorite(props.selected.path)
    })

    const queryField = ref<Vue | null>(null)

    const focusQuery = () => {
      ;(queryField.value?.$el.querySelector(
        'input'
      ) as HTMLInputElement).focus()
    }
    const handleClickPresentation = () => {
      context.root.$eventBus.$emit('show-presentation', props.selected)
    }
    const handleClickFavorite = () => {
      props.selected && favoriteStore.toggle(props.selected.path)
    }
    const handleClickList = () => {
      explorerStore.setListStyle('list')
    }
    const handleClickThumbnail = () => {
      explorerStore.setListStyle('thumbnail')
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
      queryHistoryStore.removeHistory(item)
    }

    onMounted(() => {
      context.root.$eventBus.$on('focus-query', focusQuery)
    })

    onUnmounted(() => {
      context.root.$eventBus.$off('focus-query', focusQuery)
    })

    watch(
      () => props.query,
      (query) => {
        state.searchInput = query
      }
    )

    return {
      state,
      listColor,
      thumbnailColor,
      queryHistories,
      favorite,
      queryField,
      handleClickPresentation,
      handleClickFavorite,
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
