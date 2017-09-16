<template>
  <div class="viewer">
    <div class="error" v-if="error">
      <span>{{ error.message }}</span>
    </div>
    <img v-else :src="currentFile.path" @error="loadError"/>
  </div>
</template>

<script>
import { remote } from 'electron'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      hasLoadError: false
    }
  },
  created () {
    if (!this.fullScreen) {
      return
    }
    const browserWindow = remote.getCurrentWindow()
    browserWindow.setFullScreen(true)
    browserWindow.setMenuBarVisibility(false)
  },
  beforeDestroy () {
    const browserWindow = remote.getCurrentWindow()
    browserWindow.setFullScreen(false)
    browserWindow.setMenuBarVisibility(true)
  },
  computed: {
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
      'fullScreen'
    ])
  },
  methods: {
    loadError (e) {
      this.hasLoadError = true
    }
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
