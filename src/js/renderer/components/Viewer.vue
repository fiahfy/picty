<template>
  <v-layout
    class="viewer"
    fill-height
    tabindex="1"
    @keydown="onKeyDown"
  >
    <viewer-container :class="getContainerClass" />
    <viewer-toolbar
      ref="toolbar"
      :class="getToolbarClass"
    />
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import ViewerContainer from './ViewerContainer'
import ViewerToolbar from './ViewerToolbar'

export default {
  components: {
    ViewerContainer,
    ViewerToolbar
  },
  data () {
    return {
      toolbar: null
    }
  },
  computed: {
    getContainerClass () {
      return {
        hidden: this.toolbar === false
      }
    },
    getToolbarClass () {
      return {
        'fade-in': this.toolbar === true,
        'fade-out': this.toolbar === false
      }
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
    onKeyDown (e) {
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
      moveNext: 'viewer/moveNext'
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

.viewer-container {
  flex: 1;
  overflow: hidden;
  &.hidden {
    cursor: none;
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
</style>
