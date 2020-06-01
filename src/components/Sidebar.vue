<template>
  <v-navigation-drawer class="sidebar" permanent app :width="width">
    <v-row class="fill-height flex-nowrap" no-gutters>
      <activity-bar
        class="flex-shrink-0"
        :navigator="state.navigator"
        @click-menu="handleClickMenu"
      />
      <FilesNavigator />
    </v-row>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from '@vue/composition-api'
import ActivityBar from '~/components/ActivityBar.vue'
import FilesNavigator from '~/components/FilesNavigator.vue'

export default defineComponent({
  components: {
    ActivityBar,
    FilesNavigator,
  },
  setup(_props: {}) {
    const state = reactive({
      navigator: 'files',
    })

    const width = computed(() => {
      return state.navigator ? 512 : 48
    })

    const handleClickMenu = (item: any) => {
      state.navigator =
        state.navigator === item.navigator ? undefined : item.navigator
    }

    return {
      state,
      width,
      handleClickMenu,
    }
  },
})
</script>
