<template>
  <v-toolbar
    ref="toolbar"
    class="presentation-bottom-toolbar"
    color="transparent"
    flat
    dense
  >
    <v-btn
      :title="'View previous image' | accelerator('Left')"
      icon
      @click="handleClickPrevious"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <v-btn
      :title="'View next image' | accelerator('Right')"
      icon
      @click="handleClickNext"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>

    <span class="px-3 ellipsis">{{ page }} / {{ maxPage }}</span>

    <v-slider
      ref="slider"
      v-model="pageModel"
      class="px-3"
      :min="1"
      :max="maxPage"
      dense
      hide-details
    />

    <v-spacer />

    <v-menu
      v-model="state.active"
      :close-on-click="false"
      :close-on-content-click="false"
      top
      offset-y
      nudge-top="12"
    >
      <template v-slot:activator="{ on }">
        <v-btn title="Zoom" icon v-on="on">
          <v-icon>mdi-magnify-plus-outline</v-icon>
        </v-btn>
      </template>
      <v-toolbar ref="menubar" flat dense dark>
        <v-btn
          :title="'Zoom in' | accelerator('CmdOrCtrl+Plus')"
          icon
          @click="handleClickZoomIn"
        >
          <v-icon>mdi-magnify-plus-outline</v-icon>
        </v-btn>
        <span class="px-3">{{ displayScale }}%</span>
        <v-btn
          :title="'Zoom out' | accelerator('CmdOrCtrl+-')"
          icon
          @click="handleClickZoomOut"
        >
          <v-icon>mdi-magnify-minus-outline</v-icon>
        </v-btn>
        <v-btn
          :title="'Reset' | accelerator('CmdOrCtrl+0')"
          text
          @click="handleClickZoomReset"
        >
          Reset
        </v-btn>
      </v-toolbar>
    </v-menu>

    <v-btn
      :title="fullScreen ? 'Exit fullscreen' : 'Fullscreen'"
      icon
      @click="handleClickToggleFullScreen"
    >
      <v-icon>
        {{ fullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}
      </v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  computed,
  reactive,
  ref,
} from '@vue/composition-api'

type Props = {
  page: number
  maxPage: number
  scale: number
  fullScreen: boolean
}

export default defineComponent({
  props: {
    page: {
      type: Number,
      default: 0,
    },
    maxPage: {
      type: Number,
      default: 0,
    },
    scale: {
      type: Number,
      default: 1,
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive({ active: false })

    const pageModel = computed({
      get: () => {
        return props.page
      },
      set: (value) => {
        context.emit('change-page', value)
      },
    })
    const displayScale = computed(() => {
      return (props.scale * 100).toFixed(2)
    })

    const toolbar = ref<Vue>()
    const menubar = ref<Vue>()

    const isHover = () => {
      return !!(
        toolbar.value?.$el.querySelector(':hover') ||
        menubar.value?.$el.querySelector(':hover')
      )
    }
    const hideMenu = () => {
      state.active = false
    }

    const handleClickPrevious = () => {
      context.emit('click-previous')
    }
    const handleClickNext = () => {
      context.emit('click-next')
    }
    const handleClickZoomIn = () => {
      context.emit('click-zoom-in')
    }
    const handleClickZoomOut = () => {
      context.emit('click-zoom-out')
    }
    const handleClickZoomReset = () => {
      context.emit('click-zoom-reset')
    }
    const handleClickToggleFullScreen = () => {
      context.emit('click-toggle-full-screen')
    }

    return {
      state,
      pageModel,
      displayScale,
      toolbar,
      menubar,
      isHover,
      hideMenu,
      handleClickPrevious,
      handleClickNext,
      handleClickZoomIn,
      handleClickZoomOut,
      handleClickZoomReset,
      handleClickToggleFullScreen,
    }
  },
})
</script>

<style lang="scss" scoped>
.presentation-bottom-toolbar ::v-deep .v-input__slider {
  left: 0;
  position: absolute;
  right: 0;
  top: -17px;
  z-index: 1;
}
</style>
