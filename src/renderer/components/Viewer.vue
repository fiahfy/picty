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
    <div class="wrapper" v-else>
      <img
        :src="currentFile.path"
        :class="imageClasses"
        :style="styles"
        @load="load"
        @error="loadError"
      />
    </div>
    <control-bar :class="controlBarClasses" />
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
      controlBarClasses: {},
      width: 0,
      height: 0
    }
  },
  mounted () {
    this.showControlBar()
    // this.height = this.$el.clientHeight
    // this.width = this.$el.clientWidth
  },
  computed: {
    styles () {
      return {
        // height: this.height + 'px',
        // width: this.width + 'px'
      }
    },
    imageClasses () {
      return {
        reset: true,
        stretched: this.imageStretched
      }
    },
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
    }),
    ...mapState('settings', [
      'imageStretched'
    ])
  },
  methods: {
    load (e) {
      const maxHeight = this.$el.clientHeight
      const maxWidth = this.$el.clientWidth
      const imageHeight = e.target.naturalHeight
      const imageWidth = e.target.naturalWidth
      const scaleY = maxHeight / imageHeight
      const scaleX = maxWidth / imageWidth
      const scale = scaleX < scaleY ? scaleX : scaleY
console.log(scale, this.imageStretched)
      if (scale < 1 || this.imageStretched) {
        this.height = imageHeight * scale
        this.width = imageWidth * scale
      } else {
        this.height = imageHeight
        this.width = imageWidth
      }
    },
    loadError (e) {
      this.hasLoadError = true
    },
    keydown (e) {
      switch (e.keyCode) {
        case 27:
          this.dismiss()
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
      this.controlBarClasses = ['fade-in']
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.$el.querySelector('.control-bar:hover')) {
        return
      }
      this.timer = setTimeout(() => {
        this.controlBarClasses = ['fade-out']
      }, 2000)
    },
    ...mapActions('viewer', [
      'dismiss',
      'viewPreviousImage',
      'viewNextImage'
    ])
  },
  watch: {
    currentFile () {
      this.hasLoadError = false
      this.height = 0
      this.width = 0
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
.wrapper {
  bottom:0;
  left: 0;
  overflow: auto;
  position: absolute;
  right: 0;
  top:0;
}
img {
  bottom:0;
  left: 0;
  position: absolute;
  right: 0;
  top:0;
  vertical-align: middle;
  &.reset {
    margin: auto;
    max-height: 100%;
    max-width: 100%;
  }
  &.stretched {
    height: 100%;
    object-fit: contain;
    width: 100%;
  }

}
.control-bar {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
}
::-webkit-scrollbar {
  display: none;
}
</style>
