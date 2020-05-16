<template>
  <v-card class="explorer-card" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-btn
        :title="'New Bookmark' | accelerator('CmdOrCtrl+N')"
        icon
        @click="onAddClick"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn
        :title="'Remove' | accelerator('CmdOrCtrl+Backspace')"
        :disabled="!canRemoveBookmark"
        icon
        @click="onRemoveClick"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline" primary-title>
          Add a bookmark
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="form.valid">
            <v-text-field
              v-model="form.filepath"
              :rules="[
                () => form.filepath.length > 0 || 'This field is required',
              ]"
              required
              type="text"
              label="Path"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="onCloseClick">Cancel</v-btn>
          <v-btn color="primary" text :disabled="!form.valid" @click="onSubmit">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { layoutBookmarkStore } from '~/store'

export default {
  data() {
    return {
      form: {
        valid: false,
        filepath: '',
      },
    }
  },
  computed: {
    dialog() {
      return layoutBookmarkStore.dialog
    },
    canRemoveBookmark() {
      return layoutBookmarkStore.canRemoveBookmark
    },
  },
  methods: {
    onAddClick() {
      layoutBookmarkStore.showDialog()
    },
    onRemoveClick() {
      layoutBookmarkStore.removeBookmark()
    },
    onCloseClick() {
      layoutBookmarkStore.dismissDialog()
    },
    onSubmit() {
      layoutBookmarkStore.addBookmark({ filepath: this.form.filepath })
      this.form.filepath = ''
      layoutBookmarkStore.dismissDialog()
    },
  },
}
</script>
