<template>
  <div class="viewer">
    <div class="error" v-if="error">
      <span>Invalid Image</span>
    </div>
    <img v-else :src="currentImage"/>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'viewer',
  computed: mapState([
    'error',
    'currentImage'
  ]),
  created () {
    document.addEventListener('keyup', this.keyup)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.keyup)
  },
  methods: {
    keyup (e) {
      switch (e.keyCode) {
        case 27:
          this.closeViewer()
          break
        case 37:
        case 48:
          this.viewPreviousImage()
          break
        case 39:
        case 40:
          this.viewNextImage()
          break
      }
    },
    ...mapMutations([
      'viewPreviousImage',
      'viewNextImage',
      'closeViewer'
    ])
  }
}
</script>

<style scoped lang="scss">
.viewer {
  height: 100%;
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
