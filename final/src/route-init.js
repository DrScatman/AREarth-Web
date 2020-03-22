import Login from "@/components/Login.vue";
import Viewer from "@/components/Viewer.vue";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routeTable = [
    { path: "/", component: Viewer },
    { path: "/Login", component: Login }
];

const AppRouter = new VueRouter({ routes: routeTable, mode: "history" });

export { AppRouter };
