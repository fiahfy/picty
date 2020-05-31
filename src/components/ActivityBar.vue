<template>
  <v-navigation-drawer
    class="activity-bar"
    permanent
    mini-variant
    mini-variant-width="48"
  >
    <v-layout column fill-height>
      <v-list dense class="py-0">
        <v-list-item-group :value="index" color="primary">
          <v-list-item
            v-for="item in items"
            :key="item.navigator"
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
import { defineComponent, computed, SetupContext } from '@vue/composition-api'

type Item = {
  navigator: string
  icon: string
  title: string
  accelerator: string
  path: string
}

const items = [
  {
    navigator: 'files',
    icon: 'mdi-compass',
    title: 'Explorer',
    accelerator: 'CmdOrCtrl+Shift+E',
  },
]

type Props = {
  navigator?: string
}

export default defineComponent({
  props: {
    navigator: {
      type: String,
      default: undefined,
    },
  },
  setup(props: Props, context: SetupContext) {
    const index = computed(() => {
      return items.findIndex((item) => item.navigator === props.navigator)
    })

    const handleClickItem = (item: Item) => {
      context.emit('click-menu', item)
    }

    const handleClickSettings = () => {
      context.root.$eventBus.$emit('show-settings')
    }

    return {
      items,
      index,
      handleClickItem,
      handleClickSettings,
    }
  },
})
</script>
