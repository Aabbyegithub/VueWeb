<template>
  <li>
    <div class="menu-item" @click="handleItemClick">
      <span>{{ menuItem.name }}</span>
      <span v-if="hasChildren" :class="{ open: isSubmenuOpen }">▾</span>
    </div>
    <ul v-if="hasChildren" class="submenu" v-show="isSubmenuOpen">
      <menu-item
        v-for="(submenuItem, subIndex) in menuItem.children"
        :key="subIndex"
        :menu-item="submenuItem"
        @navigate="navigateTo"
      ></menu-item>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    menuItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isSubmenuOpen: false,
    };
  },
  computed: {
    hasChildren() {
      return this.menuItem.children && this.menuItem.children.length > 0;
    },
  },
  methods: {
    handleItemClick() {
      if (this.hasChildren) {
        this.isSubmenuOpen = !this.isSubmenuOpen;
      } else {
        this.navigateTo(this.menuItem.path);
      }
    },
    navigateTo(path) {
      if (path) {
        this.$emit('navigate', path);
      }
    },
  },
};
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  transition: background-color 0.2s;
  border-bottom: 1px solid #3a4a5e;
}

.menu-item span {
  margin-left: 0.5rem;
}

.menu-item .open {
  margin-left: auto;
}

.menu-item:hover,
.menu-item:focus-within {
  background-color: #3a4a5e;
}

.submenu {
  list-style: none;
  padding-left: 0; /* 移除左边距，使宽度一致 */
}
</style>
