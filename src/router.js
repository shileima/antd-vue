import Vue from "vue";
import Router from "vue-router";
import findLast from "lodash/findLast";
//import RenderRouterView from "_c/RenderRouterView.vue";
import NotFound from "@/views/404";
import Forbidden from "@/views/403";
import {notification} from "ant-design-vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { check, isLogin } from "./util/auth";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/user",
      // component: RenderRouterView,
      // component: {render: h => h('router-view')},
      component: () =>
        import(/* webpackChunkName: "layouts" */ "./layouts/UserLayout.vue"),
      children: [
        {
          path: "/user",
          redirect: "/user/login"
        },
        {
          path: "/user/login",
          name: "login",
          hideInMenu: true,
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/User/Login.vue")
        },
        {
          path: "/user/register",
          name: "register",
          hideInMenu: true,
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/User/Register")
        }
      ]
    },
    {
      path: "/",
      meta: { authority: ["admin", "user"] },
      component: () =>
        import(/* webpackChunkName: "layout" */ "@/layouts/BasicLayout"),
      children: [
        // dashboard
        {
          path: "/dashboard",
          name: "dashboard",
          meta: {
            icon: "dashboard",
            title: "仪表盘",
            authority: ["admin", "user"]
          },
          redirect: "/dashboard/workplace",
          component: { render: h => h("router-view") },
          children: [
            {
              path: "/dashboard/analysis",
              name: "Analysis",
              meta: { title: "分析页", authority: ["admin"] },
              component: () => import("@/views/dashboard/Analysis")
            },
            // 外部链接
            {
              path: "https://www.baidu.com/",
              name: "Monitor",
              meta: { title: "监控页（外部）", target: "_blank" }
            },
            {
              path: "/dashboard/workplace",
              name: "Workplace",
              component: { render: h => h("router-view") },
              meta: { title: "工作台", target: "_blank" }
            }
          ]
        },
        // forms
        {
          path: "/form",
          name: "form",
          redirect: "/form/base-form",
          component: { render: h => h("router-view") },
          meta: { title: "表单页", icon: "form", authority: ["user"] },
          children: [
            {
              path: "/form/base-form",
              name: "BaseForm",
              meta: { title: "基础表单", authority: ["user"] },
              hideChildrenMenu: true,
              component: () => import("@/views/form/BasicForm")
            },
            {
              path: "/form/step-form",
              name: "StepForm",
              meta: { title: "分步表单", authority: ["user"] },
              component: () => import("@/views/form/stepForm/StepForm")
            },
            {
              path: "/form/advanced-form",
              name: "AdvanceForm",
              meta: { title: "高级表单",authority: ["user"] },
              component: () => import("@/views/form/advancedForm/AdvancedForm")
            }
          ]
        }
      ]
    },
    {
      path: "/403",
      name: 403,
      hideInMenu: true,
      component: Forbidden
    },
    {
      path: "*",
      name: 404,
      hideInMenu: true,
      component: NotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.path !== from.path) {
    NProgress.start();
  }
  const record = findLast(to.matched, record => record.meta.authority);
  if (record && !check(record.meta.authority)) {
    if (!isLogin() && to.path !== "/user/login") {
      next({
        path: "/user/login"
      });
    } else if (to.path !== "/403") {
      notification.error({
        message: "403 无权限",
        description: "请联系管理员添加权限！"
      });
      next({
        path: "/403"
      });
    }
    NProgress.done();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
