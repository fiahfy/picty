<template>
  <v-navigation-drawer
    class="activity-bar"
    permanent
    app
    mini-variant
    mini-variant-width="48"
  >
    <v-list dense class="py-0">
      <v-list-item-group v-model="index" color="primary">
        <v-list-item
          v-for="item in items"
          :key="item.id"
          class="py-1"
          :title="item.title | accelerator(item.accelerator)"
          @click="() => onItemClick(item)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      items: [
        {
          id: 'explorer',
          icon: 'mdi-compass',
          title: 'Explorer',
          accelerator: 'CmdOrCtrl+Shift+E',
          path: '/explorer',
        },
        {
          id: 'bookmark',
          icon: 'mdi-star-outline',
          title: 'Bookmark',
          accelerator: 'CmdOrCtrl+Shift+B',
          path: '/bookmark',
        },
        {
          id: 'settings',
          icon: 'mdi-cog-outline',
          title: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          path: '/settings',
        },
      ],
    }
  },
  watch: {
    $route(value) {
      this.index = this.items.findIndex((item) => item.path === value.path)
    },
  },
  methods: {
    onItemClick(item) {
      this.$router.push(item.path)
    },
  },
}
</script>
