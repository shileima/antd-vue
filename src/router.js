import Vue from "vue";
import Router from "vue-router";
//import RenderRouterView from "_c/RenderRouterView.vue";
import NotFound from "@/views/404";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

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
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/User/Login.vue")
        },
        {
          path: "/user/register",
          name: "register",
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/User/Register")
        }
      ]
    },
    {
      path: "/",
      component: () =>
        import(/* webpackChunkName: "layout" */ "@/layouts/BasicLayout"),
      children: [
        // dashboard
        {
          path: "/dashboard",
          name: "dashboard",
          redirect: "/dashboard/workplace",
          component: { render: h => h("router-view") },
          children: [
            {
              path: "/dashboard/analysis",
              name: "Analysis",
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
              component: { render: h => h("router-view") }
            }
          ]
        },
        // forms
        {
          path: "/form",
          redirect: "/form/base-form",
          component: { render: h => h("router-view") },
          meta: { title: "表单页", icon: "form", permission: ["form"] },
          children: [
            {
              path: "/form/base-form",
              name: "BaseForm",
              component: () => import("@/views/form/BasicForm")
            },
            {
              path: "/form/step-form",
              name: "StepForm",
              component: () => import("@/views/form/stepForm/StepForm")
            },
            {
              path: "/form/advanced-form",
              name: "AdvanceForm",
              component: () => import("@/views/form/advancedForm/AdvancedForm")
            }
          ]
        }
      ]
    },
    {
      path: "*",
      name: 404,
      component: NotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
