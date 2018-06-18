<template>
  <v-dialog
    v-model="viewing"
    transition="no-transition"
    fullscreen
    hide-overlay
    @keydown="onKeyDown"
  >
    <v-layout
      column
      fill-height
    >
      <v-flex>
        <title-bar :app="false" />
      </v-flex>
      <v-container
        :class="containerClasses"
        card
        fluid
        pa-0
        overflow-hidden
      >
        <viewer-content class="fill-height" />
        <viewer-toolbar ref="toolbar" />
      </v-container>
    </v-layout>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TitleBar from '~/components/TitleBar'
import ViewerContent from './ViewerContent'
import ViewerToolbar from './ViewerToolbar'

export default {
  components: {
    TitleBar,
    ViewerContent,
    ViewerToolbar
  },
  data () {
    return {
      toolbar: null
    }
  },
  computed: {
    containerClasses () {
      return {
        'toolbar-fade-in': this.toolbar === true,
        'toolbar-fade-out': this.toolbar === false,
        'toolbar-hidden': this.toolbar === false
      }
    },
    ...mapState({
      viewing: state => state.viewing
    })
  },
  watch: {
    viewing (value) {
      if (value) {
        this.showToolbar()
        document.body.addEventListener('mousemove', this.onMouseMove)
      } else {
        this.toolbar = null
        this.clearTimer()
        document.body.removeEventListener('mousemove', this.onMouseMove)
      }
    }
  },
  methods: {
    onKeyDown (e) {
      switch (e.keyCode) {
        case 27:
          this.dismiss()
          break
        case 37:
          if (e.target.getAttribute('role') !== 'slider') {
            this.movePreviousFile()
            this.resetTimer()
          }
          break
        case 38:
          this.movePreviousFile()
          this.resetTimer()
          break
        case 39:
          if (e.target.getAttribute('role') !== 'slider') {
            this.moveNextFile()
            this.resetTimer()
          }
          break
        case 40:
          this.moveNextFile()
          this.resetTimer()
          break
      }
    },
    onMouseMove (e) {
      this.showToolbar()
    },
    clearTimer () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    setTimer () {
      this.timer = setTimeout(() => {
        this.toolbar = false
        this.$refs.toolbar.hideMenu()
      }, 2000)
    },
    resetTimer () {
      this.clearTimer()
      if (this.$refs.toolbar.isHover()) {
        return
      }
      this.setTimer()
    },
    showToolbar () {
      if (this.toolbar === false) {
        this.toolbar = true
      }
      this.resetTimer()
    },
    ...mapActions({
      dismiss: 'dismissViewer',
      movePreviousFile: 'viewer/movePreviousFile',
      moveNextFile: 'viewer/moveNextFile'
    })
  }
}
</script>

<style scoped lang="scss">
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(48px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(48px);
  }
}

.container {
  &.toolbar-hidden {
    .viewer-content {
      cursor: none;
    }
  }
  &.toolbar-fade-in {
    .viewer-toolbar {
      animation: fade-in 350ms forwards;
    }
  }
  &.toolbar-fade-out {
    .viewer-toolbar {
      animation: fade-out 350ms forwards;
    }
  }
  .viewer-toolbar {
    bottom: 0;
    position: absolute;
  }
}
</style>
