<template>
  <li
    v-bind="$attrs"
    class="mdc-list-item"
    role="menuitem"
    tabindex="0"
    v-on="$listeners"
  >
    <slot />
  </li>
</template>
