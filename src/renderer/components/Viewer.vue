<template>
  <div
    class="viewer mdc-theme--background"
    tabindex="-1"
    @keydown="keydown"
    @mousemove="mousemove"
  >
    <div class="error" v-if="error">
      <span>{{ error.message }}</span>
    </div>
    <img :src="currentFile.path" @error="loadError" v-else/>
    <control-bar :class="classes"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ControlBar from '../components/ControlBar'

export default {
  components: {
    ControlBar
  },
  data () {
    return {
      hasLoadError: false,
      classes: {}
    }
  },
  mounted () {
    this.showControlBar()
  },
  computed: {
    ...mapState('viewer', {
      error (state) {
        if (state.error) {
          return state.error
        }
        if (this.hasLoadError) {
          return new Error('Image Load Failure')
        }
        return null
      },
      currentFile: 'currentFile'
    })
  },
  methods: {
    loadError (e) {
      this.hasLoadError = true
    },
    keydown (e) {
      switch (e.keyCode) {
        case 27:
          this.dismissViewer()
          break
        case 37:
        case 40:
          if (e.target.getAttribute('role') !== 'slider') {
            this.viewPreviousImage()
          }
          break
        case 38:
        case 39:
          if (e.target.getAttribute('role') !== 'slider') {
            this.viewNextImage()
          }
          break
      }
    },
    mousemove () {
      this.showControlBar()
    },
    showControlBar () {
      this.classes = ['fade-in']
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.$el.querySelector('.control-bar:hover')) {
        return
      }
      this.timer = setTimeout(() => {
        this.classes = ['fade-out']
      }, 2000)
    },
    ...mapActions('viewer', [
      'dismissViewer',
      'viewPreviousImage',
      'viewNextImage'
    ])
  },
  watch: {
    currentFile () {
      this.hasLoadError = false
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/animation/functions";

@keyframes fade-in {
  from {
    transform: translateY(48px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes fade-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(48px);
    opacity: 0;
  }
}

.fade-in {
  animation: mdc-animation-enter(fade-in, 350ms) forwards;
}
.fade-out {
  animation: mdc-animation-enter(fade-out, 350ms) forwards;
}

.viewer {
  bottom:0;
  left: 0;
  outline: none;
  position: absolute;
  right: 0;
  top:0;
  user-select: none;
}
.error {
  display: table;
  height: 100%;
  vertical-align: middle;
  width: 100%;
  span {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
}
img {
  bottom:0;
  left: 0;
  margin:auto;
  max-height: 100%;
  max-width: 100%;
  position: absolute;
  right: 0;
  top:0;
  vertical-align: middle;
}
.control-bar {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
}
</style>
