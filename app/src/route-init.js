import Login from "@/components/Login.vue";
import Container from "@/components/Container.vue";
import Vue from "vue";
import VueRouter from "vue-router";

import { AppAuth } from './components/db-init.js'

Vue.use(VueRouter);

const routeTable = [
    { path: "/", name: "Container", component: Container },
    { path: "/Login", name: "Login", component: Login }
];

const AppRouter = new VueRouter({ routes: routeTable, mode: "history", base: process.env.BASE_URL });

let getCurrentUser = () => {
    return new Promise((resolve) => {
        const unsubscribe = AppAuth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        });
    })
};

AppRouter.beforeEach(async (to, from, next) => {
    let user = await getCurrentUser();
    if(to.name !== 'Login' && !user) {
        next({name: 'Login'});
    }
    else if(to.name !== 'Login' && !user.emailVerified) {
        next({name: 'Login'});
    }
    else if(to.name === 'Login' && user && user.emailVerified) {
        next({name: 'Container'})
    }
    else {
        console.log("no where to go")
        next()
    }
})

export { AppRouter };
