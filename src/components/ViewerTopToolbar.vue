<template>
  <v-toolbar class="viewer-top-toolbar" color="transparent" flat dense>
    <v-btn
      :title="'Close' | accelerator('Esc')"
      flat
      icon
      @click="onCloseClick"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <span class="px-3 ellipsis">{{ title }}</span>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      hovered: false,
    }
  },
  computed: {
    title() {
      if (!this.currentFile) {
        return ''
      }
      return this.currentFile.dirname + ' - ' + this.currentFile.name
    },
    ...mapGetters('local/viewer', ['currentFile']),
  },
  methods: {
    onCloseClick() {
      this.dismiss()
    },
    isHover() {
      return !!this.$el.querySelector(':hover')
    },
    ...mapActions('local/viewer', ['dismiss']),
  },
}
</script>
