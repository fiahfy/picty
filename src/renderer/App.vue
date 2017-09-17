<template>
  <div id="app" :class="classes">
    <title-bar v-if="hasTitleBar"/>
    <div class="container" v-show="!isViewing">
      <activity-bar/>
      <div class="content">
        <router-view/>
      </div>
    </div>
    <viewer v-if="isViewing"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ActivityBar from './components/ActivityBar'
import TitleBar from './components/TitleBar'
import Viewer from './components/Viewer'

export default {
  components: {
    ActivityBar,
    TitleBar,
    Viewer
  },
  computed: {
    classes () {
      return {
        'mdc-theme--dark': this.darkTheme
      }
    },
    hasTitleBar () {
      return process.platform !== 'win32'
    },
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
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  height: 100%;
  text-align: center;
  &.mdc-theme--dark {
    background-color: #303030;
    color: white;
  }
}
.container {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.content {
  flex: 1;
}
.viewer {
  flex: 1;
}
</style>
