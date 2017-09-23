<template>
  <div id="app" :class="classes">
    <title-bar v-if="hasTitleBar"/>
    <div class="container">
      <activity-bar/>
      <div class="content">
        <router-view/>
      </div>
      <viewer v-if="isViewing"/>
    </div>
    <mdc-snackbar :message="message"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
  computed: {
    classes () {
      return {
        'mdc-theme--background': true,
        'mdc-theme--dark': this.darkTheme
      }
    },
    hasTitleBar () {
      return process.platform !== 'win32'
    },
    ...mapState([
      'message'
    ]),
    ...mapState('viewer', [
      'isViewing'
    ]),
    ...mapState('settings', [
      'darkTheme'
    ])
  }
}
</script>

<style scoped lang="scss">
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
.mdc-theme--dark {
  color: white;
  &.mdc-theme--background, .mdc-theme--background {
    background-color: #303030;
  }
}
</style>
