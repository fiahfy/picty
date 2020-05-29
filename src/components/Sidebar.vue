<template>
  <v-navigation-drawer class="sidebar" permanent app>
    <v-row class="fill-height" no-gutters>
      <activity-bar />
      <v-list class="grow">
        <v-list-item v-for="link in ['foo', 'bar']" :key="link" link>
          <v-list-item-title v-text="link"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-row>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import ActivityBar from '~/components/ActivityBar.vue'

export default defineComponent({
  components: {
    ActivityBar,
  },
  setup(_props: {}) {
    return {}
  },
})
</script>
