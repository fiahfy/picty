<template>
  <div
    class="viewer mdc-theme--background"
    tabindex="-1"
    :class="classes"
    @keydown="keydown"
    @mousemove="mousemove"
    @mousedown="mousedown"
    @mouseup="mouseup"
  >
    <div class="error" v-if="error">
      {{ error.message }}
    </div>
    <div class="wrapper" ref="wrapper" v-else>
      <img
        draggable="false"
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
      classes: {
        hidden: false
      },
      imageClasses: {
        contain: true,
        scaling: false,
        stretched: this.imageStretched
      },
      controlBarClasses: {},
      originalSize: {
        width: 0,
        height: 0
      }
    }
  },
  mounted () {
    this.showControlBar()
  },
  computed: {
    styles () {
      return this.scaling ? {
        height: this.originalSize.height * this.scale + 'px',
        width: this.originalSize.width * this.scale + 'px'
      } : {}
    },
    ...mapState({
      error: function (state) {
        if (state.viewer.error) {
          return state.viewer.error
        }
        if (this.hasLoadError) {
          return new Error('Image Load Failure')
        }
        return null
      },
      currentFile: state => state.viewer.currentFile,
      scale: state => state.viewer.scale,
      scaling: state => state.viewer.scaling,
      imageStretched: state => state.settings.imageStretched
    })
  },
  methods: {
    load (e) {
      const maxHeight = this.$el.clientHeight
      const maxWidth = this.$el.clientWidth
      const imageHeight = e.target.naturalHeight
      const imageWidth = e.target.naturalWidth
      const scaleY = maxHeight / imageHeight
      const scaleX = maxWidth / imageWidth
      let scale = scaleX < scaleY ? scaleX : scaleY
      if (scale >= 1 && !this.imageStretched) {
        scale = 1
      }
      this.originalSize = {
        height: imageHeight,
        width: imageWidth
      }
      this.initZoom({ scale })
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
    mousedown (e) {
      this.scrolling = true
      this.classes.scrolling = true
    },
    mouseup (e) {
      this.scrolling = false
      this.classes.scrolling = false
      this.pos = null
    },
    mousemove (e) {
      if (this.scrolling) {
        const pos = {x: e.clientX, y: e.clientY}
        if (this.pos) {
          this.$refs.wrapper.scrollTop += this.pos.y - e.clientY
          this.$refs.wrapper.scrollLeft += this.pos.x - e.clientX
        }
        this.pos = pos
      }
      this.showControlBar()
    },
    showControlBar () {
      this.classes.hidden = false
      this.controlBarClasses = ['fade-in']
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.$el.querySelector('.control-bar:hover')) {
        return
      }
      this.timer = setTimeout(() => {
        this.classes.hidden = true
        this.controlBarClasses = ['fade-out']
      }, 2000)
    },
    ...mapActions({
      dismiss: 'viewer/dismiss',
      viewPreviousImage: 'viewer/viewPreviousImage',
      viewNextImage: 'viewer/viewNextImage',
      initZoom: 'viewer/initZoom'
    })
  },
  watch: {
    currentFile () {
      this.hasLoadError = false
      this.height = 0
      this.width = 0
    },
    scaling (value) {
      this.imageClasses = {
        ...this.imageClasses,
        scaling: value
      }
    },
    scale (value) {
      this.imageClasses = {
        ...this.imageClasses,
        contain: this.$el.clientHeight > this.originalSize.height * value
      }
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
  bottom: 0;
  cursor: pointer;
  left: 0;
  outline: none;
  position: absolute;
  right: 0;
  top:0;
  user-select: none;
  &.hidden {
    cursor: none;
  }
  &.scrolling {
    cursor: move;
  }
}
.error {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
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
  &.contain {
    margin: auto
  }
  &:not(.scaling) {
    max-height: 100%;
    max-width: 100%;
    &.stretched {
      height: 100%;
      object-fit: contain;
      width: 100%;
    }
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
