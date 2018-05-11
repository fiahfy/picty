<template>
  <div
    class="viewer"
    tabindex="0"
    @keydown="onKeyDown"
  >
    <viewer-container
      :class="containerClasses"
      class="fill-height"
    />
    <viewer-toolbar
      ref="toolbar"
      :class="toolbarClasses"
    />
  </div>
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
    containerClasses () {
      return {
        hidden: this.toolbar === false
      }
    },
    toolbarClasses () {
      return {
        'fade-in': this.toolbar === true,
        'fade-out': this.toolbar === false
      }
    }
  },
  mounted () {
    this.showToolbar()
    document.body.addEventListener('mousemove', this.onMouseMove)
  },
  beforeDestroy () {
    this.clearTimer()
    document.body.removeEventListener('mousemove', this.onMouseMove)
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
        this.$refs.toolbar.hideMenu()
        this.$el.focus()
      }, 2000)
    },
    showToolbar () {
      if (this.toolbar === false) {
        this.toolbar = true
      }
      this.clearTimer()
      if (this.$refs.toolbar.isHover()) {
        return
      }
      this.setTimer()
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
