import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { AppRouter } from './route-init.js';
import { store } from './store.js'

import 'vue2-dropzone/dist/vue2Dropzone.min.css'

Vue.config.productionTip = false

new Vue({
    store: store,
    vuetify,
    render: h => h(App),
    router: AppRouter
}).$mount('#app')
