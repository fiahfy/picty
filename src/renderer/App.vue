<template>
  <div
    id="app"
    class="mdc-theme--background"
    :style="styles"
    @contextmenu="contextmenu"
    @dragover.prevent
    @drop.prevent="drop"
  >
    <template v-if="titleBar">
      <title-bar />
      <divider />
    </template>
    <div class="container">
      <viewer v-if="viewing" />
      <template v-else>
        <activity-bar />
        <divider orientation="vertical" />
        <div class="content">
          <router-view />
        </div>
      </template>
    </div>
    <mdc-snackbar :message="message" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Theme from './theme'
import ActivityBar from './components/ActivityBar'
import Divider from './components/Divider'
import MdcSnackbar from './components/MdcSnackbar'
import TitleBar from './components/TitleBar'
import Viewer from './components/Viewer'
import * as ContextMenu from './utils/context-menu'

export default {
  components: {
    ActivityBar,
    Divider,
    MdcSnackbar,
    TitleBar,
    Viewer
  },
  async asyncData ({ store }) {
    await store.dispatch('explorer/initDirectory')
    await store.dispatch('bookmark/load')
  },
  computed: {
    styles () {
      return this.darkTheme ? Theme.dark : Theme.light
    },
    ...mapState({
      message: state => state.message,
      viewing: state => state.viewing,
      darkTheme: state => state.settings.darkTheme
    }),
    ...mapGetters({
      titleBar: 'titleBar'
    })
  },
  methods: {
    contextmenu (e) {
      ContextMenu.show(e)
    },
    drop (e) {
      const files = Array.from(e.dataTransfer.files)
      if (!files.length) {
        return
      }
      const filepathes = files.map(file => file.path)
      this.open({ filepathes })
    },
    ...mapActions({
      open: 'open'
    })
  }
}
</script>

<style lang="scss">
@import '~material-design-icons/iconfont/material-icons.css';
@import '~material-components-web/material-components-web.scss';

::-webkit-scrollbar {
  width: 14px;
  -webkit-appearance: none;
}
::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar);
  &:hover {
    background-color: var(--scrollbar-hover);
  }
  &:active {
    background-color: var(--scrollbar-active);
  }
}
</style>

<style scoped lang="scss">
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: small;
  height: 100%;
  .container {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
    .content {
      flex: 1;
    }
  }
}
</style>
