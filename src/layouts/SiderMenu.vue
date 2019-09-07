<template>
  <div style="width: 200px">
    <a-menu :selectedKeys="selectedKeys" :openKeys.sync="openKeys" mode="inline" :theme="theme">
      <template v-for="item in menuData">
        <a-menu-item
          v-if="!item.children"
          :key="item.path"
          @click="() => $router.push({path:item.path,query:$route.query})"
        >
          <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
          <span>{{item.meta.title}}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.path" />
      </template>
    </a-menu>
  </div>
</template>

<script>
/*
 * recommend SubMenu.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu.vue
 * SubMenu1.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu1.vue
 * */
import SubMenu from "./SubMenu";
export default {
  props: {
    theme: {
      type: String,
      default: "dark"
    }
  },
  components: {
    "sub-menu": SubMenu
  },
  watch: {
    "$route.path": function(val) {
      this.selectedKeys = this.selectedKeysMap[val];
      this.openKeys = this.collapsed ? [] : this.openKeysMap[val];
    }
  },
  mounted() {
    console.log(this.selectedKeys);
    console.log(this.openKeys);
  },
  data() {
    this.selectedKeysMap = {};
    this.openKeysMap = {};
    const menuData = this.getMenuData(this.$router.options.routes);
    return {
      collapsed: false,
      menuData,
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.collapsed ? [] : this.openKeysMap[this.$route.path]
    };
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    getMenuData(routes = [], parentKeys = [], selectedKeys) {
      const menuData = [];
      routes.forEach(route => {
        if (route.name && !route.hideInMenu) {
          this.openKeysMap[route.path] = parentKeys;
          this.selectedKeysMap[route.path] = [selectedKeys || route.path];
          const newRoute = { ...route };
          delete newRoute.children;
          if (route.children && !route.hideChildrenMenu) {
            newRoute.children = this.getMenuData(route.children, [
              ...parentKeys,
              route.path
            ]);
          } else {
            this.getMenuData(
              route.children,
              selectedKeys ? parentKeys : [...parentKeys, route.path],
              selectedKeys || route.path
            );
          }
          menuData.push(newRoute);
        } else if (
          !route.hideInMenu &&
          !route.hideChildrenMenu &&
          route.children
        ) {
          menuData.push(
            ...this.getMenuData(route.children, [...parentKeys, route.path])
          );
        }
      });
      console.log(menuData);
      return menuData;
    }
  }
};
</script>
