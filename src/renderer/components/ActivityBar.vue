<template>
  <div class="activity-bar">
    <ul>
      <li v-for="item in items" :key="item.routeName">
        <mdc-button @click="changeRoute(item)">
          <mdc-icon :icon="item.icon" :checked="item.checked" />
        </mdc-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import MdcButton from '../components/MdcButton'
import MdcIcon from '../components/MdcIcon'

export default {
  name: 'activity-bar',
  components: {
    MdcButton,
    MdcIcon
  },
  data () {
    return {
      items: [
        { icon: 'list', name: 'explorer', checked: true },
        { icon: 'settings', name: 'settings', checked: false }
      ]
    }
  },
  methods: mapMutations([
    'changeRoute'
  ]),
  watch: {
    '$route' (to) { // eslint-disable-line object-shorthand
      this.items = this.items.map(item => (
        Object.assign({}, {
          ...item,
          checked: item.routeName === to.name
        })
      ))
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color_palette.scss";

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
</style>
