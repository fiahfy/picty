<template>
  <div class="activity-bar">
    <ul>
      <li v-for="menu in menus" :key="menu.routeName">
        <mdc-button class="mdc-button" @click="click(menu.routeName)">
          <mdc-icon :icon="menu.icon" :checked="menu.checked" />
        </mdc-button>
      </li>
    </ul>
  </div>
</template>

<script>
import MdcButton from '../components/MdcButton'
import MdcIcon from '../components/MdcIcon'

export default {
  name: 'activity-bar',
  components: { MdcButton, MdcIcon },
  data() {
    return {
      menus: [
        { icon: "list", routeName: "main", checked: true },
        { icon: "settings", routeName: "settings", checked: false },
      ],
    };
  },
  methods: {
    click(routeName) {
      this.$router.push({ name: routeName });
    },
  },
  watch: {
    '$route'(to, from) {
      this.menus = this.menus.map(menu => {
        menu.checked = menu.routeName === to.name;
        return menu;
      });
    },
  },
};
</script>

<style scoped>
.activity-bar {
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
  min-width: auto;
  padding: 0;
}
</style>
