<template>
  <v-navigation-drawer class="activity-bar" mini-variant permanent app>
    <v-list class="pt-0">
      <v-list-tile
        v-for="item in items"
        :key="item.id"
        :title="item.title | accelerator(item.accelerator)"
        @click="(e) => onItemClick(e, item)"
      >
        <v-list-tile-action>
          <v-icon :color="getColor(item)">{{ item.icon }}</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          id: 1,
          icon: 'explore',
          title: 'Explorer',
          accelerator: 'CmdOrCtrl+Shift+E',
          path: '/explorer'
        },
        {
          id: 2,
          icon: 'star',
          title: 'Bookmark',
          accelerator: 'CmdOrCtrl+Shift+B',
          path: '/bookmark'
        },
        {
          id: 3,
          icon: 'settings',
          title: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          path: '/settings'
        }
      ]
    }
  },
  methods: {
    getColor(item) {
      return this.getActive(item) ? 'primary' : null
    },
    getActive(item) {
      return item.path === this.$route.path
    },
    onItemClick(e, item) {
      this.$router.push(item.path)
    }
  }
}
</script>
