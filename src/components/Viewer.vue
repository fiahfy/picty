<template>
  <v-dialog
    v-model="viewing"
    transition="no-transition"
    fullscreen
    hide-overlay
    @keydown="onKeyDown"
  >
    <v-card :class="classes">
      <v-layout
        column
        fill-height
      >
        <title-bar />
        <v-content class="fill-height pl-0">
          <v-container
            fill-height
            fluid
            pa-0
          >
            <v-layout column>
              <v-progress-linear
                v-if="loading"
                :indeterminate="true"
              />
              <v-container
                fluid
                pa-0
                overflow-hidden
              >
                <viewer-content class="fill-height" />
              </v-container>
            </v-layout>
          </v-container>
        </v-content>
      </v-layout>
    </v-card>
    <v-bottom-sheet
      v-model="sheet"
      class="elevation-0"
      hide-overlay
      persistent
    >
      <v-layout class="pt-3">
        <viewer-toolbar ref="toolbar" />
      </v-layout>
    </v-bottom-sheet>
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
      sheet: false
    }
  },
  computed: {
    classes () {
      return {
        'bottom-sheet-hidden': !this.sheet
      }
    },
    ...mapState([
      'viewing'
    ]),
    ...mapState('local/viewer', [
      'loading'
    ])
  },
  watch: {
    viewing (value) {
      if (value) {
        this.showBottomSheet()
        document.body.addEventListener('mousemove', this.onMouseMove)
      } else {
        this.sheet = false
        this.clearTimer()
        document.body.removeEventListener('mousemove', this.onMouseMove)
      }
    }
  },
  methods: {
    onKeyDown (e) {
      switch (e.keyCode) {
        case 27:
          this.dismissViewer()
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
      this.showBottomSheet()
    },
    clearTimer () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    setTimer () {
      this.timer = setTimeout(() => {
        this.sheet = false
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
    showBottomSheet () {
      if (!this.sheet) {
        this.sheet = true
      }
      this.resetTimer()
    },
    ...mapActions([
      'dismissViewer'
    ]),
    ...mapActions('local/viewer', [
      'movePreviousFile',
      'moveNextFile'
    ])
  }
}
</script>

<style scoped lang="scss">
.v-card {
  height: 100%!important;
  &.bottom-sheet-hidden {
    .viewer-content {
      cursor: none;
    }
  }
  .container .layout {
    position: relative;
    .v-progress-linear {
      left: 0;
      margin: 0;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
.v-bottom-sheet {
  box-shadow: none;
  .layout {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  }
}
</style>
