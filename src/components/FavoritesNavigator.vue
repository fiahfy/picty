<template>
  <v-layout column class="files-navigator">
    <v-toolbar flat dense class="flex-grow-0">
      <span class="subtitle-2 text-uppercase user-select-none flex-grow-0">
        Favorites
      </span>
    </v-toolbar>
    <v-row no-gutters class="overflow-auto scrollbar">
      <v-list dense class="flex-grow-1">
        <v-list-item
          v-for="favorite of favorites"
          :key="favorite.path"
          @click="() => handleClickItem(favorite)"
        >
          <v-list-item-title>{{ favorite.path }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, computed, SetupContext } from '@vue/composition-api'
import ActivityBar from '~/components/ActivityBar.vue'
import { favoriteStore } from '~/store'

export default defineComponent({
  components: {
    ActivityBar,
  },
  setup(_props: {}, context: SetupContext) {
    const favorites = computed(() => favoriteStore.favoritesAll)

    const handleClickItem = (favorite: any) => {
      context.root.$eventBus.$emit('change-location', favorite.path)
    }

    return {
      favorites,
      handleClickItem,
    }
  },
})
</script>
