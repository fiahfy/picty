<template>
  <div class="activity-bar">
    <v-list class="pa-0">
      <v-list-tile
        v-for="item in items"
        :key="item.name"
        :title="item.title"
        @click="changeRoute({ name: item.name })"
      >
        <v-list-tile-action class="justify-center">
          <v-icon :color="item.color">{{ item.icon }}</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { buildText } from '../utils/accelerator'

export default {
  data () {
    return {
      items: [
        { name: 'explorer', icon: 'view_list', title: `explorer (${buildText('CmdOrCtrl+Shift+E')})` },
        { name: 'bookmark', icon: 'star', title: `bookmark (${buildText('CmdOrCtrl+Shift+B')})` },
        { name: 'settings', icon: 'settings', title: `settings (${buildText('CmdOrCtrl+,')})` }
      ]
    }
  },
  watch: {
    '$route' (to) { // eslint-disable-line object-shorthand
      this.updateItems(to.name)
    }
  },
  mounted () {
    this.updateItems(this.$route.name)
  },
  methods: {
    updateItems (name) {
      this.items = this.items.map(item => ({
        ...item,
        color: item.name === name ? 'primary' : null
      }))
    },
    ...mapActions({
      changeRoute: 'changeRoute'
    })
  }
}
</script>

<style scoped lang="scss">
.activity-bar /deep/ .list {
  background: inherit;
}
.activity-bar /deep/ .list__tile {
  padding: 0;
}
.activity-bar /deep/ .list__tile__action {
  min-width: 48px;
}
</style>
