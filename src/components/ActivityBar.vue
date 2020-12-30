<template>
  <v-navigation-drawer
    class="activity-bar"
    permanent
    mini-variant
    mini-variant-width="48"
  >
    <div class="d-flex flex-column fill-height">
      <v-list dense class="py-0">
        <v-list-item-group :value="index" color="primary">
          <v-list-item
            v-for="menu in menus"
            :key="menu.navigator"
            :title="menu.title | accelerator(menu.accelerator)"
            class="py-1"
            @click="() => handleClickItem(menu)"
          >
            <v-list-item-icon>
              <v-icon v-text="menu.icon" />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="menu.title" />
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
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  SetupContext,
} from '@nuxtjs/composition-api'
import { Navigator } from '~/components/Sidebar.vue'

type Menu = {
  navigator: Navigator
  icon: string
  title: string
  accelerator: string
}

const menus: Menu[] = [
  {
    navigator: 'folders',
    icon: 'mdi-folder',
    title: 'Folders',
    accelerator: '',
  },
  {
    navigator: 'favorites',
    icon: 'mdi-heart',
    title: 'Favorites',
    accelerator: '',
  },
]

type Props = {
  navigator?: Navigator
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
      return menus.findIndex((menu) => menu.navigator === props.navigator)
    })

    const handleClickItem = (menu: Menu) => {
      context.emit('click:menu', menu)
    }

    const handleClickSettings = () => {
      context.root.$eventBus.$emit('show-settings')
    }

    return {
      menus,
      index,
      handleClickItem,
      handleClickSettings,
    }
  },
})
</script>
