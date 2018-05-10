<template>
  <v-data-table
    ref="table"
    v-bind="$attrs"
    :pagination.sync="paginationModel"
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
        :style="{ height: `${offset.top}px` }"
      />
      <slot
        v-if="props.index >= offset.first && props.index < offset.last"
        v-bind="props"
        name="items"
      />
      <tr
        v-if="props.index === pagination.totalItems - 1"
        :style="{ height: `${offset.bottom}px` }"
      />
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      estimatedHeight: 48,
      offset: {
        top: 0,
        bottom: 0
      },
      offsetIndex: {
        first: 0,
        last: 0
      }
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
    filteredItems () {
      return this.$refs.table.filteredItems
    }
  },
  mounted () {
    this.container = this.$el.querySelector('.table__overflow')
    this.container.addEventListener('scroll', this.onScroll)
    this.$nextTick(() => {
      this.onScroll()
    })
  },
  beforeDestroy () {
    this.container.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll () {
      const top = this.container.scrollTop
      const offset = Math.ceil(this.container.offsetHeight / this.estimatedHeight)
      const first = Math.max(0, Math.floor(top / this.estimatedHeight))
      const last = Math.min(first + offset, this.pagination.totalItems)
      // this.offsetIndex = {
      //   first,
      //   last: Math.min(first + offset, this.pagination.totalItems)
      // }
      this.$nextTick(() => {
      this.offset = {
        first, last,
        top: first * this.estimatedHeight,
        bottom: (this.pagination.totalItems - last) * this.estimatedHeight
      }
      })
      // console.log(top, (this.offset.top == this.offset.first * 48), (this.offset.bottom == (this.pagination.totalItems - this.offset.last) * 48))
    }
  }
}
</script>

<style scoped lang="scss">
.virtual-data-table /deep/ .table__overflow::-webkit-scrollbar {
  width: 14px;
  -webkit-appearance: none;
}
.virtual-data-table /deep/ .table__overflow::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  &:hover {
    background-color: rgba(0, 0, 0, 0.25);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.35);
  }
}

.virtual-data-table /deep/ .table__overflow {
  height: 100%;
  overflow-y: auto;
}
.virtual-data-table /deep/ .datatable__progress {
  display: none;
}
</style>
