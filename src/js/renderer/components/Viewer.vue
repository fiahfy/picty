<template>
  <v-layout
    :class="getClass"
    class="viewer"
    fill-height
    tabindex="1"
    @keydown="keydown"
  >
    <v-flex v-if="message">
      {{ message }}
    </v-flex>
    <v-flex
      v-else
      ref="wrapper"
      class="wrapper"
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      <img
        :src="`file://${currentFile.path}`"
        :class="getImageClass"
        :style="getStyle"
        draggable="false"
        @load="onLoad"
        @error="onError"
      >
    </v-flex>
    <viewer-toolbar
      ref="toolbar"
      :class="getToolbarClass"
    />
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ViewerToolbar from './ViewerToolbar'

export default {
  components: {
    ViewerToolbar
  },
  data () {
    return {
      loadError: false,
      dragging: false,
      toolbar: null,
      centered: {
        horizontal: true,
        vertical: true
      },
      originalSize: {
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    message () {
      return this.error ? this.error.message : ''
    },
    getStyle () {
      return this.scaling ? {
        width: this.originalSize.width * this.scale + 'px',
        height: this.originalSize.height * this.scale + 'px'
      } : {}
    },
    getClass () {
      return {
        hidden: this.toolbar === false,
        dragging: this.dragging
      }
    },
    getToolbarClass () {
      return {
        'fade-in': this.toolbar === true,
        'fade-out': this.toolbar === false
      }
    },
    getImageClass () {
      return {
        'horizontal-center': this.centered.horizontal,
        'vertical-center': this.centered.vertical,
        scaling: this.scaling,
        stretched: this.imageStretched
      }
    },
    ...mapState({
      error: function (state) {
        if (state.viewer.error) {
          return state.viewer.error
        }
        if (this.loadError) {
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
  watch: {
    currentFile () {
      this.loadError = false
    },
    scale (newValue, oldValue) {
      if (this.error) {
        return
      }
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

        this.centered.horizontal = this.$el.clientWidth >= this.originalSize.width * newValue
        this.centered.vertical = this.$el.clientHeight >= this.originalSize.height * newValue
      })
    }
  },
  mounted () {
    this.showToolbar()
    document.body.addEventListener('mousemove', this.mousemove)
  },
  beforeDestroy () {
    this.$el.removeEventListener('scroll', this.scroll)
    document.body.removeEventListener('mousemove', this.mousemove)
  },
  methods: {
    keydown (e) {
      switch (e.keyCode) {
        case 27:
          this.dismiss()
          break
        case 37:
          if (e.target.getAttribute('role') !== 'slider') {
            this.movePrevious()
          }
          break
        case 38:
          this.movePrevious()
          break
        case 39:
          if (e.target.getAttribute('role') !== 'slider') {
            this.moveNext()
          }
          break
        case 40:
          this.moveNext()
          break
      }
    },
    mousemove (e) {
      this.showToolbar()
    },
    onMouseDown (e) {
      this.dragging = true
    },
    onMouseUp (e) {
      this.dragging = false
      this.scrollPosition = null
    },
    onMouseMove (e) {
      if (this.error) {
        return
      }
      if (this.dragging) {
        const position = { x: e.clientX, y: e.clientY }
        if (this.scrollPosition) {
          this.$refs.wrapper.scrollLeft += this.scrollPosition.x - position.x
          this.$refs.wrapper.scrollTop += this.scrollPosition.y - position.y
        }
        this.scrollPosition = position
      }
    },
    onLoad (e) {
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
    onError (e) {
      this.loadError = true
    },
    showToolbar () {
      if (this.toolbar === false) {
        this.toolbar = true
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.$refs.toolbar.isHover()) {
        return
      }
      this.timer = setTimeout(() => {
        this.toolbar = false
        this.$refs.toolbar.hide()
        this.$el.focus()
      }, 2000)
    },
    ...mapActions({
      dismiss: 'viewer/dismiss',
      movePrevious: 'viewer/movePrevious',
      moveNext: 'viewer/moveNext',
      initZoom: 'viewer/initZoom'
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

::-webkit-scrollbar {
  display: none;
}

.viewer {
  &.hidden .wrapper {
    cursor: none;
  }
  &.dragging .wrapper {
    cursor: -webkit-grabbing;
  }
  .wrapper {
    cursor: -webkit-grab;
    overflow: auto;
    position: relative;
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
  }
  .viewer-toolbar {
    bottom: 0;
    position: absolute;
    &.fade-in {
      animation: fade-in 350ms forwards;
    }
    &.fade-out {
      animation: fade-out 350ms forwards;
    }
  }
}
</style>
