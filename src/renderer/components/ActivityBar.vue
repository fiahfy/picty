<template>
  <div class="activity-bar">
    <ul>
      <li :key="item.routeName" v-for="item in items">
        <mdc-button @click="changeRoute({ name: item.name })" :title="item.title">
          <mdc-icon :icon="item.icon" :class="item.classes" />
        </mdc-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MdcButton from '../components/MdcButton'
import MdcIcon from '../components/MdcIcon'
import { title } from '../utils/accelerator'

export default {
  components: {
    MdcButton,
    MdcIcon
  },
  data () {
    return {
      items: [
        { icon: 'list', name: 'explorer', title: title('explorer', 'CmdOrCtrl+Shift+E') },
        { icon: 'settings', name: 'settings', title: title('settings', 'CmdOrCtrl+,') }
      ]
    }
  },
  mounted () {
    this.updateItems(this.$route.name)
  },
  methods: {
    updateItems (name) {
      this.items = this.items.map(item => (
        Object.assign({}, {
          ...item,
          classes: {
            selected: item.name === name
          }
        })
      ))
    },
    ...mapActions([
      'changeRoute'
    ])
  },
  watch: {
    '$route' (to) { // eslint-disable-line object-shorthand
      this.updateItems(to.name)
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color-palette.scss";

.activity-bar {
  border-right-color: $material-color-grey-300;
  border-right-style: solid;
  border-right-width: 1px;
  overflow: hidden;
  width: 48px;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mdc-button {
  border-radius: 0;
  height: auto;
  line-height: initial;
  min-width: auto;
  padding: 0;
}
.mdc-icon:not(.selected) {
  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38));
  &:hover {
    color: inherit;
  }
}
.mdc-theme--dark {
  .activity-bar {
    border-right-color: $material-color-grey-600;
  }
  .mdc-icon:not(.selected) {
    color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5));
    &:hover {
      color: inherit;
    }
  }
}
</style>
