<template>
  <v-navigation-drawer
    class="activity-bar"
    permanent
    app
    mini-variant
    mini-variant-width="48"
  >
    <v-list dense class="py-0">
      <v-list-item-group v-model="index" color="primary">
        <v-list-item
          v-for="item in items"
          :key="item.id"
          class="py-1"
          :title="item.title | accelerator(item.accelerator)"
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
  {
    id: 'settings',
    icon: 'mdi-cog',
    title: 'Settings',
    accelerator: 'CmdOrCtrl+,',
    path: '/settings',
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

    return {
      index,
      items,
      handleClickItem,
    }
  },
})
</script>
