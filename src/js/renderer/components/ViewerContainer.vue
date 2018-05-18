<template>
  <v-container
    :class="classes"
    class="viewer-container"
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
          :src="`file://${filepath}`"
          :class="imageClasses"
          :style="imageStyles"
          draggable="false"
          @load="onLoad"
          @error="onError"
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
    message () {
      return this.error ? this.error.message : ''
    },
    classes () {
      return {
        dragging: this.dragging
      }
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
      error: function (state) {
        if (state.viewer.error) {
          return state.viewer.error
        }
        if (this.loadError) {
          return new Error('Image Load Failure')
        }
        return null
      },
      filepath: state => state.app.viewer.filepath,
      scale: state => state.app.viewer.scale,
      scaling: state => state.app.viewer.scaling,
      imageStretched: state => state.settings.imageStretched
    })
  },
  watch: {
    filepath () {
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
      this.setupZoom({ scale })
    },
    onError (e) {
      this.loadError = true
    },
    ...mapActions({
      setupZoom: 'app/viewer/setupZoom'
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
