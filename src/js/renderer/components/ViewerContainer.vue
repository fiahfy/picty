<template>
  <v-layout
    :class="getClass"
    class="viewer-container"
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
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      loadError: false,
      dragging: false,
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
    getClass () {
      return {
        dragging: this.dragging
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
    getStyle () {
      return this.scaling ? {
        width: this.originalSize.width * this.scale + 'px',
        height: this.originalSize.height * this.scale + 'px'
      } : {}
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
  methods: {
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
    ...mapActions({
      initZoom: 'viewer/initZoom'
    })
  }
}
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  display: none;
}

.viewer-container {
  cursor: -webkit-grab;
  &.dragging {
    cursor: -webkit-grabbing;
  }
}
.wrapper {
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
      margin-top: auto;
      margin-bottom: auto;
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
</style>
