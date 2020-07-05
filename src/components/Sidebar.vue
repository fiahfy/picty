<template>
  <v-navigation-drawer
    ref="sidebar"
    class="sidebar"
    permanent
    app
    :width="width"
    :class="classes"
  >
    <div class="d-flex fill-height">
      <activity-bar
        class="flex-shrink-0"
        :navigator="state.navigator"
        @click:menu="handleClickMenu"
      />
      <keep-alive>
        <component :is="component" class="flex-grow-1" style="min-width: 0;" />
      </keep-alive>
      <div v-show="state.navigator" ref="resizer" class="resizer" />
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  ref,
  onMounted,
  onUnmounted,
} from '@vue/composition-api'
import ActivityBar from '~/components/ActivityBar.vue'
import FavoritesNavigator from '~/components/FavoritesNavigator.vue'
import FoldersNavigator from '~/components/FoldersNavigator.vue'
import { settingsStore } from '~/store'

const offsetWidth = 48
const minWidth = 256

export type Navigator = 'folders' | 'favorites'

export default defineComponent({
  components: {
    ActivityBar,
  },
  setup() {
    const state = reactive<{
      resizing: boolean
      navigator?: Navigator
    }>({
      resizing: false,
      navigator: 'folders',
    })

    const width = computed({
      get: () => {
        return state.navigator
          ? settingsStore.sidebarWidth + offsetWidth
          : offsetWidth
      },
      set: (value) => {
        settingsStore.setSidebarWidth({ sidebarWidth: value - offsetWidth })
      },
    })
    const classes = computed(() => {
      return { resizing: state.resizing }
    })
    const component = computed(() => {
      switch (state.navigator) {
        case 'folders':
          return FoldersNavigator
        case 'favorites':
          return FavoritesNavigator
      }
    })

    const sidebar = ref<Vue>()
    const resizer = ref<HTMLDivElement>()

    const handleClickMenu = (menu: { navigator: Navigator }) => {
      state.navigator =
        state.navigator === menu.navigator ? undefined : menu.navigator
    }

    const handleMouseDown = () => {
      state.resizing = true
      document.body.style.cursor = 'ew-resize'
      document.addEventListener('mousemove', handleMouseMove)
    }

    const handleMouseUp = () => {
      if (!state.resizing) {
        return
      }
      state.resizing = false
      width.value = (sidebar.value?.$el as HTMLElement).offsetWidth ?? 0
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', handleMouseMove)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebar.value) {
        return
      }
      let w = e.clientX - sidebar.value.$el.getBoundingClientRect().left
      w = Math.max(
        minWidth + offsetWidth,
        Math.min(w, window.innerWidth - minWidth)
      )
      ;(sidebar.value?.$el as HTMLElement).style.width = w + 'px'
    }

    onMounted(() => {
      if (resizer.value) {
        resizer.value.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)
      }
    })

    onUnmounted(() => {
      if (resizer.value) {
        resizer.value.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    })

    return {
      state,
      width,
      classes,
      component,
      sidebar,
      resizer,
      handleClickMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.sidebar {
  &.resizing {
    transition: none;
  }
  ::v-deep .v-navigation-drawer__content {
    .resizer {
      position: absolute;
      right: -1px;
      height: 100%;
      padding: 0 1px;
      z-index: 1;
      cursor: ew-resize;
    }
  }
}
</style>
