<template>
  <v-dialog
    v-model="viewing"
    transition="no-transition"
    fullscreen
    hide-overlay
    @keydown="onKeyDown"
  >
    <v-card
      :class="classes"
      dark
      flat
      tile
    >
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
          <v-layout class="top-overlay pb-5">
            <viewer-top-toolbar ref="top-toolbar" />
          </v-layout>
          <v-layout class="bottom-overlay pt-5">
            <viewer-bottom-toolbar ref="bottom-toolbar" />
          </v-layout>
        </v-content>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TitleBar from '~/components/TitleBar'
import ViewerContent from './ViewerContent'
import ViewerBottomToolbar from './ViewerBottomToolbar'
import ViewerTopToolbar from './ViewerTopToolbar'

export default {
  components: {
    TitleBar,
    ViewerContent,
    ViewerBottomToolbar,
    ViewerTopToolbar
  },
  data () {
    return {
      toolbar: null
    }
  },
  computed: {
    classes () {
      return {
        'toolbar-hidden': this.toolbar === false,
        'toolbar-fade-in': this.toolbar === true,
        'toolbar-fade-out': this.toolbar === false
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
          this.dismissViewer()
          break
        case 37:
          this.movePreviousFile()
          break
        case 38:
          this.movePreviousFile()
          break
        case 39:
          this.moveNextFile()
          break
        case 40:
          this.moveNextFile()
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
        this.$refs['bottom-toolbar'].hideMenu()
      }, 2000)
    },
    resetTimer () {
      this.clearTimer()
      if (this.$refs['top-toolbar'].isHover() || this.$refs['bottom-toolbar'].isHover()) {
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
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.v-card {
  height: 100%!important;
  &.toolbar-hidden {
    .viewer-content {
      cursor: none;
    }
  }
  &.toolbar-fade-in {
    .top-overlay, .bottom-overlay {
      animation: fade-in .3s forwards;
    }
  }
  &.toolbar-fade-out {
    .top-overlay, .bottom-overlay {
      animation: fade-out .3s forwards;
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
  .top-overlay {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
  .bottom-overlay {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
  }
}
</style>
