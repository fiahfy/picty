<template>
  <div class="viewer">
    <div class="error" v-if="message">
      <span>{{ message }}</span>
    </div>
    <img v-else :src="viewer.currentFile.path" @error="loadError"/>
  </div>
</template>

<script>
import { remote } from 'electron'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'viewer',
  data () {
    return {
      error: false
    }
  },
  computed: {
    message () {
      if (this.viewer.error || this.error) {
        return 'Invalid Image'
      } else if (!this.viewer.currentFile) {
        return 'Not Found'
      }
      return ''
    },
    ...mapState([
      'viewer',
      'settings'
    ])
  },
  created () {
    document.addEventListener('keyup', this.keyup)
    if (this.settings.fullScreen) {
      const browserWindow = remote.getCurrentWindow()
      browserWindow.setFullScreen(true)
      browserWindow.setMenuBarVisibility(false)
    }
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.keyup)
    const browserWindow = remote.getCurrentWindow()
    browserWindow.setFullScreen(false)
    browserWindow.setMenuBarVisibility(true)
  },
  methods: {
    keyup (e) {
      switch (e.keyCode) {
        case 27:
          this.setViewerViewing(false)
          break
        case 37:
        case 48:
          this.error = false
          this.viewPreviousImage()
          break
        case 39:
        case 40:
          this.error = false
          this.viewNextImage()
          break
      }
    },
    loadError (e) {
      this.error = true
    },
    ...mapMutations([
      'viewPreviousImage',
      'viewNextImage',
      'setViewerViewing'
    ])
  }
}
</script>

<style scoped lang="scss">
.viewer {
  position:relative;
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
  position:absolute;
  right: 0;
  top:0;
  vertical-align: middle;
}
</style>
