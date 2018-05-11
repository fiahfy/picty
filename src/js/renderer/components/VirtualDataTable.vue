<template>
  <v-data-table
    ref="table"
    v-bind="$attrs"
    v-model="model"
    :pagination.sync="paginationModel"
    :items="items"
    :class="classes"
    class="virtual-data-table"
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <slot
        v-bind="props"
        name="headers"
      />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <tr
        v-if="props.index === 0"
        :style="{ height: `${padding.top}px` }"
      />
      <slot
        v-if="props.index >= offset.top && props.index < offset.bottom"
        v-bind="props"
        :selected="props.selected"
        name="items"
      />
      <tr
        v-if="props.index === pagination.totalItems - 1"
        :style="{ height: `${padding.bottom}px` }"
      />
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    stickyHeaders: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: [],
      estimatedHeight: 48,
      offset: {
        top: 0,
        bottom: 0
      },
      padding: {
        top: 0,
        bottom: 0
      },
      scrolling: false
    }
  },
  computed: {
    paginationModel: {
      get () {
        return this.pagination
      },
      set (value) {
        this.$emit('update:pagination', value)
      }
    },
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('update:value', value)
      }
    },
    classes () {
      return {
        'sticky-headers': this.stickyHeaders,
        scrolling: this.scrolling
      }
    },
    filteredItems () {
      return this.$refs.table.filteredItems
    }
  },
  watch: {
    items () {
      this.onScroll()
      this.$nextTick(() => {
        this.onScroll()
      })
    }
  },
  mounted () {
    window.addEventListener('resize', this.onScroll)
    this.container = this.$el.querySelector('.table__overflow')
    this.container.addEventListener('scroll', this.onScroll)
    this.$nextTick(() => {
      this.onScroll()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onScroll)
    this.container.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    setScrollTop (value) {
      this.$nextTick(() => {
        this.container.scrollTop = value
      })
    },
    onScroll () {
      const { scrollTop, offsetHeight } = this.container
      const offset = Math.ceil(offsetHeight / this.estimatedHeight)
      const top = Math.max(0, Math.floor(scrollTop / this.estimatedHeight) + (this.stickyHeaders ? 0 : -1))
      const bottom = Math.min(top + offset, this.pagination.totalItems)
      this.scrolling = scrollTop > 0
      this.offset = { top, bottom }
      this.padding = {
        top: top * this.estimatedHeight,
        bottom: (this.pagination.totalItems - bottom) * this.estimatedHeight
      }
      this.$emit('scroll', {
        scrollTop,
        offsetHeight
      })
    }
  }
}
</script>

<style lang="scss">
.theme--dark .virtual-data-table /deep/ .table__overflow::-webkit-scrollbar-thumb {
  background-color: #424242!important;
  &:hover {
    background-color: #505050!important;
  }
  &:active {
    background-color: #616161!important;
  }
}
</style>

<style scoped lang="scss">
.virtual-data-table.sticky-headers {
  & /deep/ .table__overflow {
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 14px;
      -webkit-appearance: none;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #eee;
      &:hover {
        background-color: #ddd;
      }
      &:active {
        background-color: #ccc;
      }
    }
    .datatable>thead {
      background: inherit;
      &>tr {
        background: inherit;
        &>th {
          background: inherit;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        &.datatable__progress>th {
          top: 56px;
          z-index: 0;
          &:after {
            bottom: 0;
            box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
            content: '';
            left: 0;
            position: absolute;
            width: 100%;
          }
        }
      }
    }
  }
  &.scrolling /deep/ .datatable>thead>tr {
    border-bottom: none;
    &.datatable__progress>th:after {
      height: 10px;
    }
  }
}
</style>
