<template>
  <v-container
    :class="classes"
    class="viewer-content"
    fluid
    pa-0
  >
    <v-layout fill-height>
      <v-flex v-if="message">
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            text-xs-center
            subheading
          >{{ message }}</v-flex>
        </v-layout>
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
          :src="imageSrc"
          :class="imageClasses"
          :style="imageStyles"
          draggable="false"
          @load="onImageLoad"
          @error="onImageError"
        >
      </v-flex>
    </v-layout>
  </v-container>
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
    classes () {
      return {
        dragging: this.dragging
      }
    },
    message () {
      if (this.loading) {
        return 'Loading...'
      }
      if (!this.files.length) {
        return 'No images'
      }
      if (this.loadError) {
        return 'Invalid image'
      }
      return this.error ? this.error.message : ''
    },
    imageSrc () {
      return this.currentFilepath ? `file://${this.currentFilepath}` : ''
    },
    imageClasses () {
      return {
        'horizontal-center': this.centered.horizontal,
        'vertical-center': this.centered.vertical,
        scaling: this.scaling,
        stretched: this.imageStretched
      }
    },
    imageStyles () {
      return this.scaling ? {
        width: this.originalSize.width * this.scale + 'px',
        height: this.originalSize.height * this.scale + 'px'
      } : {}
    },
    ...mapState({
      loading: state => state.viewer.loading,
      error: state => state.viewer.error,
      files: state => state.viewer.files,
      currentFilepath: state => state.viewer.currentFilepath,
      scale: state => state.viewer.scale,
      scaling: state => state.viewer.scaling,
      imageStretched: state => state.settings.imageStretched
    })
  },
  watch: {
    currentFilepath () {
      this.loadError = false
    },
    scale (newValue, oldValue) {
      if (this.message) {
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
      if (this.message) {
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
    onImageLoad (e) {
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
      this.setupZoom({ scale })
    },
    onImageError (e) {
      this.loadError = true
    },
    ...mapActions({
      setupZoom: 'viewer/setupZoom'
    })
  }
}
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  display: none;
}

.viewer-content {
  cursor: -webkit-grab;
  &.dragging {
    cursor: -webkit-grabbing;
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
}
</style>
