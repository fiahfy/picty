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
        :title="'New Bookmark'|accelerator('CmdOrCtrl+N')"
        flat
        icon
        @click="onAddClick"
      >
        <v-icon>add</v-icon>
      </v-btn>
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
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
    >
      <v-card>
        <v-card-title primary-title>Add a bookmark</v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="form.valid"
          >
            <v-text-field
              v-model="form.filepath"
              :rules="[() => form.filepath.length > 0 || 'This field is required']"
              required
              type="text"
              label="Path"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            @click="onCloseClick"
          >Cancel</v-btn>
          <v-btn
            :disabled="!form.valid"
            flat
            color="primary"
            @click="onSubmit"
          >Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
      form: {
        valid: false,
        filepath: ''
      }
    }
  },
  computed: {
    ...mapState('local/bookmark', ['dialog']),
    ...mapGetters('local/bookmark', ['canRemoveBookmark'])
  },
  methods: {
    onAddClick() {
      this.showDialog()
    },
    onRemoveClick() {
      this.removeBookmark()
    },
    onCloseClick() {
      this.dismissDialog()
    },
    onSubmit() {
      this.addBookmark({ filepath: this.form.filepath })
      this.form.filepath = ''
      this.dismissDialog()
    },
    ...mapActions('local/bookmark', [
      'addBookmark',
      'removeBookmark',
      'showDialog',
      'dismissDialog'
    ])
  }
}
</script>
