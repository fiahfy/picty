<template>
  <v-layout column class="favorites-navigator">
    <v-toolbar flat dense class="flex-grow-0">
      <span class="subtitle-2 text-uppercase user-select-none flex-grow-0">
        Favorites
      </span>
    </v-toolbar>
    <v-row no-gutters class="overflow-y-auto scrollbar">
      <v-list dense class="py-0" style="width: 100%;">
        <v-list-item
          v-for="favorite of favorites"
          :key="favorite.path"
          :title="favorite.path"
          @click="() => handleClickItem(favorite)"
          @contextmenu.stop="() => handleContextMenu(favorite)"
        >
          <v-list-item-icon class="mr-3">
            <v-icon color="blue lighten-3">mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-truncate" v-text="favorite.name" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import { clipboard } from 'electron'
import { defineComponent, computed, SetupContext } from '@vue/composition-api'
import { Favorite } from '~/models'
import { favoriteStore } from '~/store'

export default defineComponent({
  setup(_props: {}, context: SetupContext) {
    const favorites = computed(() => favoriteStore.favoritesAll)

    const handleClickItem = (favorite: Favorite) => {
      context.root.$eventBus.$emit('change-location', favorite.path)
    }

    const handleContextMenu = (favorite: Favorite) => {
      context.root.$contextMenu.open([
        {
          label: 'Delete',
          click: () => favoriteStore.delete(favorite.path),
        },
        { type: 'separator' },
        {
          label: 'Copy Path',
          click: () => clipboard.writeText(favorite.path),
        },
      ])
    }

    return {
      favorites,
      handleClickItem,
      handleContextMenu,
    }
  },
})
</script>
