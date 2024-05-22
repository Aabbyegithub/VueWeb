<template>
  <ul class="menu">
    <menu-item
      v-for="(menuItem, index) in menuItems"
      :key="index"
      :menu-item="menuItem"
      @navigate="navigateTo"
    ></menu-item>
  </ul>
</template>

<script>
import MenuItem from './MenuItem.vue';

export default {
  name: 'RecursiveMenu',
  components: {
    MenuItem,
  },
  props: {
    menuItems: {
      type: Array,
      required: true,
    },
  },
  methods: {
    navigateTo(path) {
      this.$emit('navigate', path);
    },
  },
};
</script>

<style scoped>
.menu {
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
}

.menu ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
