<template>
  <v-toolbar class="explorer-toolbar" flat dense>
    <v-btn
      v-long-press="handleContextMenuBack"
      :title="'Back' | accelerator('CmdOrCtrl+Left')"
      :disabled="loading || !canBack"
      icon
      @click="handleClickBack"
      @contextmenu.stop="handleContextMenuBack"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-btn
      v-long-press="handleContextMenuForward"
      :title="'Forward' | accelerator('CmdOrCtrl+Right')"
      :disabled="loading || !canForward"
      icon
      @click="handleClickForward"
      @contextmenu.stop="handleContextMenuForward"
    >
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
    <v-btn
      :title="'Up' | accelerator('CmdOrCtrl+Shift+P')"
      :disabled="loading"
      icon
      @click="handleClickUpward"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
    <v-btn :disabled="loading" title="Reload" icon @click="handleClickReload">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
    <v-btn
      :title="'Home' | accelerator('CmdOrCtrl+Shift+H')"
      :disabled="loading"
      icon
      @click="handleClickHome"
    >
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-text-field
      ref="locationField"
      v-model="state.location"
      class="ml-3"
      name="location"
      label="Path"
      prepend-inner-icon="mdi-folder"
      dense
      filled
      rounded
      single-line
      hide-details
      @click:prepend-inner="handleClickFolder"
      @keydown="handleKeyDown"
      @contextmenu.stop="handleContextMenuLocation"
    />
  </v-toolbar>
</template>

<script lang="ts">
import { shell } from 'electron'
import {
  defineComponent,
  computed,
  reactive,
  watch,
  ref,
  onMounted,
  onUnmounted,
  SetupContext,
} from '@nuxtjs/composition-api'
import { explorerStore, historyStore } from '~/store'

type Props = {
  loading: boolean
}

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props: Props, context: SetupContext) {
    const state = reactive({ location: explorerStore.location })

    const canBack = computed(() => historyStore.canBack)
    const canForward = computed(() => historyStore.canForward)

    const locationField = ref<Vue>()

    const focusLocation = () => {
      ;(locationField.value?.$el.querySelector(
        'input'
      ) as HTMLInputElement).focus()
    }
    const handleClickBack = () => {
      context.emit('click:back')
    }
    const handleClickForward = () => {
      context.emit('click:forward')
    }
    const handleClickUpward = () => {
      context.emit('click:upward')
    }
    const handleClickReload = () => {
      context.emit('click:reload')
    }
    const handleClickHome = () => {
      context.emit('click:home')
    }
    const handleClickFolder = () => {
      shell.openItem(explorerStore.location)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        !e.isComposing &&
        e.target instanceof HTMLInputElement
      ) {
        context.emit('change:location', e.target.value)
      }
    }
    const handleContextMenuLocation = () => {
      context.root.$contextMenu.openEditMenu()
    }
    const handleContextMenuBack = () => {
      context.root.$contextMenu.open(
        historyStore.backHistories.map((history, index) => {
          return {
            label: history,
            click: () => context.emit('change:history', -1 * (index + 1)),
          }
        })
      )
    }
    const handleContextMenuForward = () => {
      context.root.$contextMenu.open(
        historyStore.forwardHistories.map((history, index) => {
          return {
            label: history,
            click: () => context.emit('change:history', index + 1),
          }
        })
      )
    }

    onMounted(() => {
      context.root.$eventBus.$on('focus-location', focusLocation)
    })

    onUnmounted(() => {
      context.root.$eventBus.$on('focus-location', focusLocation)
    })

    watch(
      () => explorerStore.location,
      (location) => {
        state.location = location
      }
    )

    return {
      state,
      canBack,
      canForward,
      locationField,
      handleClickBack,
      handleClickForward,
      handleClickUpward,
      handleClickReload,
      handleClickHome,
      handleClickFolder,
      handleKeyDown,
      handleContextMenuLocation,
      handleContextMenuBack,
      handleContextMenuForward,
    }
  },
})
</script>
