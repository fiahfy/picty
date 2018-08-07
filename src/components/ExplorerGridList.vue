<template>
  <v-container
    class="explorer-grid-list pa-0"
    fluid
    grid-list-md
  >
    <v-data-iterator
      ref="iterator"
      :items="filteredFiles"
      :loading="true"
      :no-data-text="noDataText"
      class="fill-height"
      content-tag="v-layout"
      row
      wrap
      item-key="path"
      hide-actions
      @scroll="onScroll"
      @keydown.native="onKeyDown"
    >
      <v-flex
        slot="item"
        slot-scope="props"
        xs6
        sm4
        md3
        lg2
      >
        <explorer-grid-list-item :file="props.item" />
      </v-flex>
      <v-progress-linear
        slot="progress"
        indeterminate
      />
    </v-data-iterator>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ExplorerGridListItem from './ExplorerGridListItem'

export default {
  components: {
    ExplorerGridListItem
  },
  computed: {
    noDataText () {
      if (this.loading) {
        return 'Loading...'
      }
      return this.query ? 'No matching records found' : 'No data available'
    },
    ...mapState([
      'directory'
    ]),
    ...mapState('local/explorer', [
      'loading',
      'query',
      'selectedFilepath'
    ]),
    ...mapGetters('local/explorer', [
      'filteredFiles',
      'scrollTop',
      'selectedFileIndex'
    ])
  },
  mounted () {
    this.$refs.iterator.$el.setAttribute('tabindex', 0)
  },
  methods: {
    restore () {
      const scrollTop = this.scrollTop
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(scrollTop)
      })
    },
    onScroll (e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    onKeyDown (e) {
      console.log(e)
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.viewFile({ filepath: this.selectedFilepath })
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstFile()
          } else {
            this.selectPreviousFile()
          }
          break
        case 40:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastFile()
          } else {
            this.selectNextFile()
          }
          break
      }
    },
    ...mapActions('local/explorer', [
      'selectFirstFile',
      'selectLastFile',
      'selectPreviousFile',
      'selectNextFile',
      'setScrollTop',
      'viewFile'
    ])
  }
}
</script>

<style scoped lang="scss">
.explorer-grid-list .v-data-iterator {
  overflow: auto;
  & /deep/ .layout {
    margin: 4px;
  }
}
</style>
