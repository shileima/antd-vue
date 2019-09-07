<template>
  <div :class="[`nav-theme-${navTheme}`,`nav-layout-${navLayout}`]">
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
      <a-layout-sider
        :trigger="null"
        collapsible
        v-model="collapsed"
        :theme="navTheme"
        v-if="navLayout === 'left'"
      >
        <div class="logo">Ant Design Vue</div>
        <SiderMenu :theme="navTheme" />
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0" >
          <a-icon 
            :type="collapsed ? 'menu-unfold' : 'menu-fold'" 
            @click="collapsed = !collapsed"
            style="float:left;line-height:64px;paddingLeft:20px"
            >
          </a-icon>
          <Header />
        </a-layout-header>
        <a-layout-content style="margin: 0 16px">
          <router-view></router-view>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          <Footer />
        </a-layout-footer>
      </a-layout>
    </a-layout>
    <SettingDrawer />
  </div>
</template>

<script>
import Header from './Header';
import Footer from './Footer';
import SiderMenu from './SiderMenu';
import SettingDrawer from '_c/SettingDrawer';

export default {
  data() {
    return {
      collapsed: false,
    }
  },
  computed: {
    navTheme() {
      return this.$route.query.navTheme || 'dark'
    },
    navLayout() {
      return this.$route.query.navLayout || 'left'
    }
  },
  components: {
    Header,
    SiderMenu,
    Footer,
    SettingDrawer
  }
}
</script>

<style>
.logo {
  height: 64px;
  line-height: 64px;
  text-align: center;
  font-size: 20px;
  overflow: hidden;
}
.nav-theme-dark .logo {
  color:#fff
}
</style>