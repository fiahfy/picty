<template>
  <v-app
    :dark="darkTheme"
    @contextmenu.native="contextmenu"
    @dragover.native.prevent
    @drop.native.prevent="drop"
  >
    <v-content>
      <v-container
        fluid
        fill-height
        pa-0
      >
        <v-layout column>
          <title-bar v-if="titleBar" />
          <v-flex fill-height>
            <v-layout row>
              <viewer v-if="viewing" />
              <template v-else>
                <activity-bar />
                <vertical-divider />
                <v-flex>
                  <router-view />
                </v-flex>
              </template>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ActivityBar from './components/ActivityBar'
import TitleBar from './components/TitleBar'
import Viewer from './components/Viewer'
import VerticalDivider from './components/VerticalDivider'
import * as ContextMenu from './utils/context-menu'

export default {
  components: {
    ActivityBar,
    TitleBar,
    Viewer,
    VerticalDivider
  },
  async asyncData ({ store }) {
    await store.dispatch('explorer/initDirectory')
    await store.dispatch('bookmark/load')
  },
  computed: {
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
// @import '~material-components-web/material-components-web.scss';
@import '~vuetify/dist/vuetify.min.css';

// ::-webkit-scrollbar {
//   width: 14px;
//   -webkit-appearance: none;
// }
// ::-webkit-scrollbar-thumb {
//   background-color: var(--scrollbar);
//   &:hover {
//     background-color: var(--scrollbar-hover);
//   }
//   &:active {
//     background-color: var(--scrollbar-active);
//   }
// }
</style>

<style scoped lang="scss">
.content {
  height: 100%;
}
.flex {
  overflow: hidden;
}
</style>
