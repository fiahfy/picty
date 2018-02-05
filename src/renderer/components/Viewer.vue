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
      scrolling: false,
      horizontalCentered: true,
      verticalCentered: true,
      originalSize: {
        width: 0,
        height: 0
      },
      controlBarHidden: null
    }
  },
  mounted () {
    this.showControlBar()
  },
  computed: {
    styles () {
      return this.scaling ? {
        width: this.originalSize.width * this.scale + 'px',
        height: this.originalSize.height * this.scale + 'px'
      } : {}
    },
    classes () {
      return {
        hidden: this.controlBarHidden === true,
        scrolling: this.scrolling
      }
    },
    controlBarClasses () {
      return {
        'fade-in': this.controlBarHidden === false,
        'fade-out': this.controlBarHidden === true
      }
    },
    imageClasses () {
      return {
        'horizontal-center': this.horizontalCentered,
        'vertical-center': this.verticalCentered,
        scaling: this.scaling,
        stretched: this.imageStretched
      }
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
      const maxWidth = this.$el.clientWidth
      const maxHeight = this.$el.clientHeight
      const imageWidth = e.target.naturalWidth
      const imageHeight = e.target.naturalHeight
      const scaleX = maxWidth / imageWidth
      const scaleY = maxHeight / imageHeight
      let scale = scaleX < scaleY ? scaleX : scaleY
      if (scale >= 1 && !this.imageStretched) {
        scale = 1
      }
      this.originalSize = {
        width: imageWidth,
        height: imageHeight
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
    },
    mouseup (e) {
      this.scrolling = false
      this.scrollPosition = null
    },
    mousemove (e) {
      if (this.scrolling) {
        const position = { x: e.clientX, y: e.clientY }
        if (this.scrollPosition) {
          this.$refs.wrapper.scrollLeft += this.scrollPosition.x - position.x
          this.$refs.wrapper.scrollTop += this.scrollPosition.y - position.y
        }
        this.scrollPosition = position
      }
      this.showControlBar()
    },
    showControlBar () {
      if (this.controlBarHidden === true) {
        this.controlBarHidden = false
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.$el.querySelector('.control-bar:hover')) {
        return
      }
      this.timer = setTimeout(() => {
        this.controlBarHidden = true
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
    },
    scale (newValue, oldValue) {
      this.$nextTick(() => {
        var offsetX = 0
        if (newValue > oldValue && this.$el.clientWidth > this.originalSize.width * oldValue) {
          offsetX = (this.$el.clientWidth - this.originalSize.width * oldValue) / 2
        }
        var offsetY = 0
        if (newValue > oldValue && this.$el.clientHeight > this.originalSize.height * oldValue) {
          offsetY = (this.$el.clientHeight - this.originalSize.height * oldValue) / 2
        }

        this.$refs.wrapper.scrollLeft += (newValue - oldValue) * this.originalSize.width / 2 - offsetX
        this.$refs.wrapper.scrollTop += (newValue - oldValue) * this.originalSize.height / 2 - offsetY

        this.horizontalCentered = this.$el.clientWidth >= this.originalSize.width * newValue
        this.verticalCentered = this.$el.clientHeight >= this.originalSize.height * newValue
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/animation/functions";

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
  &.horizontal-center {
    margin-left: auto;
    margin-right: auto;
  }
  &.vertical-center {
    margin-bottom: auto;
    margin-top: auto;
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
