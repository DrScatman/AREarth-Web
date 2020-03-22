import Viewer from "@/components/Viewer.vue";
import Login from "@/components/Login.vue";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routeTable = [
  { path: "/login", component: Login },
  { path: "/viewer", component: Viewer }
];

const AppRouter = new VueRouter({ routes: routeTable, mode: "history" });
export { AppRouter };
