<template>
  <div>
    main page
    <div>
<div class="mdc-select" role="listbox" tabindex="0">
  <span class="mdc-select__selected-text">Pick a food group</span>
  <div class="mdc-simple-menu mdc-select__menu">
    <ul class="mdc-list mdc-simple-menu__items">
      <li class="mdc-list-item" role="option" id="grains" aria-disabled="true">
        Pick a food group
      </li>
      <li class="mdc-list-item" role="option" id="grains" tabindex="0">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" role="option" id="vegetables" tabindex="0">
        Vegetables
      </li>
      <li class="mdc-list-item" role="option" id="fruit" tabindex="0">
        Fruit
      </li>
      <li class="mdc-list-item" role="option" id="dairy" tabindex="0">
        Milk, Yogurt, and Cheese
      </li>
      <li class="mdc-list-item" role="option" id="meat" tabindex="0">
        Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
      </li>
      <li class="mdc-list-item" role="option" id="fats" tabindex="0">
        Fats, Oils, and Sweets
      </li>
    </ul>
  </div>
</div>
</div>
<!-- <div>
<select class="mdc-select">
  <option value="" selected>Pick a food</option>
  <option value="grains">Bread, Cereal, Rice, and Pasta</option>
  <option value="vegetables">Vegetables</option>
  <optgroup label="Fruits">
    <option value="apple">Apple</option>
    <option value="oranges">Orange</option>
    <option value="banana">Banana</option>
  </optgroup>
  <option value="dairy">Milk, Yogurt, and Cheese</option>
  <option value="meat">Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts</option>
  <option value="fats">Fats, Oils, and Sweets</option>
</select>
</div> -->
    <span v-for="file in files" :key="file.name">
      <pre>{{ file.stats }}</pre>
    </span>
  </div>
</template>

<script>
import { remote } from 'electron';
import { select as mdcSelect } from 'material-components-web'

export default {
  name: 'main-page',
  mounted() {
    console.warn("OK");
    console.log(mdcSelect);
    const select = new mdcSelect.MDCSelect(document.querySelector('.mdc-select'));
    select.listen('MDCSelect:change', () => {
      alert(`Selected "${select.selectedOptions[0].textContent}" at index ${select.selectedIndex} ` +
            `with value "${select.value}"`);
    });
  },
  asyncData ({ store, route }) {
    return store.dispatch('readDir', remote.app.getPath('home'))
  },
  computed: {
    files() {
      return this.$store.state.files
    }
  }
};
</script>

<style scoped>
</style>
