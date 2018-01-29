<template>
  <div
    id="app"
    :class="classes"
    @dragover.prevent
    @drop.prevent="drop"
  >
    <title-bar v-if="titleBar" />
    <div class="container">
      <activity-bar />
      <div class="content">
        <router-view />
      </div>
      <viewer v-if="display" />
    </div>
    <mdc-snackbar :message="message" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ActivityBar from './components/ActivityBar'
import MdcSnackbar from './components/MdcSnackbar'
import TitleBar from './components/TitleBar'
import Viewer from './components/Viewer'

export default {
  components: {
    ActivityBar,
    MdcSnackbar,
    TitleBar,
    Viewer
  },
  async asyncData ({ store }) {
    await store.dispatch('explorer/initDirectory')
  },
  computed: {
    classes () {
      return {
        'mdc-theme--background': true,
        'mdc-theme--dark': this.darkTheme
      }
    },
    ...mapState([
      'message'
    ]),
    ...mapState('viewer', [
      'display'
    ]),
    ...mapState('settings', [
      'darkTheme'
    ]),
    ...mapGetters([
      'titleBar'
    ])
  },
  methods: {
    drop (e) {
      const files = Array.from(e.dataTransfer.files)
      if (!files.length) {
        return
      }
      const filepathes = files.map(file => file.path)
      this.open({ filepathes })
    },
    ...mapActions([
      'open'
    ])
  }
}
</script>

<style scoped lang="scss">
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: small;
  height: 100%;
  text-align: center;
}
.container {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}
.content {
  flex: 1;
}
.viewer {
  flex: 1;
}
</style>

<style lang="scss">
$mdc-theme-primary: #ff4081;
$mdc-theme-secondary: #ff4081;

@import '~material-components-web/material-components-web';
@import '~material-design-icons/iconfont/material-icons.css';
</style>
