<template>
  <v-card
    class="explorer-card"
    flat
    tile
  >
    <v-toolbar
      color="transparent"
      flat
    >
      <v-btn
        :title="'Remove'|accelerator('CmdOrCtrl+Backspace')"
        :disabled="!canRemoveBookmark"
        flat
        icon
        @click="onRemoveClick"
      >
        <v-icon>remove</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('local/bookmark', [
      'canRemoveBookmark'
    ])
  },
  methods: {
    onRemoveClick () {
      this.removeBookmark()
    },
    ...mapActions('local/bookmark', [
      'removeBookmark'
    ])
  }
}
</script>
