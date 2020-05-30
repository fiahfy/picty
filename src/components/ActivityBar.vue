<template>
  <v-navigation-drawer
    class="activity-bar"
    permanent
    mini-variant
    mini-variant-width="48"
  >
    <v-layout column fill-height>
      <v-list dense class="py-0">
        <v-list-item-group v-model="index" color="primary">
          <v-list-item
            v-for="item in items"
            :key="item.id"
            :title="item.title | accelerator(item.accelerator)"
            class="py-1"
            @click="() => handleClickItem(item)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-spacer />
      <v-list dense class="py-0">
        <v-list-item
          :title="'Settings' | accelerator('CmdOrCtrl+,')"
          class="py-1"
          @click="handleClickSettings"
        >
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  watchEffect,
  SetupContext,
  ref,
} from '@vue/composition-api'

type Item = {
  id: string
  icon: string
  title: string
  accelerator: string
  path: string
}

const items = [
  {
    id: 'explorer',
    icon: 'mdi-compass',
    title: 'Explorer',
    accelerator: 'CmdOrCtrl+Shift+E',
    path: '/explorer',
  },
  {
    id: 'bookmark',
    icon: 'mdi-star',
    title: 'Bookmark',
    accelerator: 'CmdOrCtrl+Shift+B',
    path: '/bookmark',
  },
]

const useList = (context: SetupContext) => {
  const index = ref(0)
  watchEffect(() => {
    index.value = items.findIndex(
      (item) => item.path === context.root.$route.path
    )
  })
  return { index }
}

export default defineComponent({
  setup(_props: {}, context: SetupContext) {
    const { index } = useList(context)

    const handleClickItem = (item: Item) => {
      context.root.$router.push(item.path)
    }

    const handleClickSettings = () => {
      context.root.$eventBus.$emit('show-settings')
    }

    return {
      index,
      items,
      handleClickItem,
      handleClickSettings,
    }
  },
})
</script>
