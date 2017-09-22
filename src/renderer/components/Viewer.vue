<template>
  <div
    class="viewer"
    tabindex="-1"
    @keydown="keydown"
  >
    <div class="error" v-if="error">
      <span>{{ error.message }}</span>
    </div>
    <img :src="currentFile.path" @error="loadError" v-else/>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      hasLoadError: false
    }
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
    })
  },
  methods: {
    loadError (e) {
      this.hasLoadError = true
    },
    keydown (e) {
      switch (e.keyCode) {
        case 27:
          this.dismissViewer()
          break
        case 37:
        case 38:
          this.hasLoadError = false
          this.viewPreviousImage()
          break
        case 39:
        case 40:
          this.hasLoadError = false
          this.viewNextImage()
          break
      }
    },
    ...mapActions('viewer', [
      'dismissViewer'
    ]),
    ...mapMutations('viewer', [
      'viewPreviousImage',
      'viewNextImage'
    ])
  }
}
</script>

<style scoped lang="scss">
.viewer {
  background-color: #fff;
  bottom:0;
  left: 0;
  outline: none;
  position: absolute;
  right: 0;
  top:0;
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
.mdc-theme--dark {
  .viewer {
    background-color: #303030;
  }
}
</style>
